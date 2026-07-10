import os
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)
CORS(app)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")
DB_NAME = os.getenv("DB_NAME", "alumniDB")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]


def build_profile_text(alumni):
    parts = []
    if alumni.get("branch"):
        parts.append(alumni["branch"])
    if alumni.get("degree"):
        parts.append(alumni["degree"])
    if alumni.get("company"):
        parts.append(alumni["company"])
    if alumni.get("designation"):
        parts.append(alumni["designation"])
    if alumni.get("location"):
        parts.append(alumni["location"])
    if alumni.get("bio"):
        parts.append(alumni["bio"])
    skills = alumni.get("skills", [])
    if skills:
        parts.extend(skills)
    work = alumni.get("workExperiences", [])
    for w in work:
        if w.get("company"):
            parts.append(w["company"])
        if w.get("workTitle"):
            parts.append(w["workTitle"])
        if w.get("industry"):
            parts.append(w["industry"])
    edu = alumni.get("education", [])
    for e in edu:
        if e.get("course"):
            parts.append(e["course"])
        if e.get("school"):
            parts.append(e["school"])
    return " ".join(parts).lower()


def build_feature_vector(alumni, label_encoders=None, fit=False):
    features = {}

    for field in ["branch", "degree", "company", "designation", "location"]:
        val = str(alumni.get(field, "") or "")
        if fit:
            if field not in label_encoders:
                label_encoders[field] = LabelEncoder()
                features[field] = label_encoders[field].fit_transform([val])[0]
            else:
                known = list(label_encoders[field].classes_)
                if val not in known:
                    known.append(val)
                    label_encoders[field].fit(known)
                features[field] = label_encoders[field].transform([val])[0]
        else:
            known = list(label_encoders[field].classes_)
            if val not in known:
                known.append(val)
                label_encoders[field].fit(known)
            features[field] = label_encoders[field].transform([val])[0]

    features["endYear"] = alumni.get("endYear") or 0
    features["startYear"] = alumni.get("startYear") or 0
    skills = alumni.get("skills", [])
    features["skillCount"] = len(skills)

    return features


@app.route("/recommend", methods=["POST"])
def recommend():
    """TF-IDF + Cosine Similarity"""
    try:
        data = request.json
        user_id = data.get("userId")
        top_n = data.get("topN", 10)

        if not user_id:
            return jsonify({"status": "fail", "message": "userId is required"}), 400

        all_alumni = list(db.alumnis.find({}))
        if len(all_alumni) < 2:
            return jsonify({"status": "success", "data": {"recommendations": []}})

        target = None
        others = []
        for a in all_alumni:
            if str(a.get("user")) == str(user_id):
                target = a
            else:
                others.append(a)

        if not target:
            others = all_alumni

        target_text = build_profile_text(target) if target else " ".join([build_profile_text(a) for a in all_alumni[:3]])
        other_texts = [build_profile_text(a) for a in others]

        all_texts = [target_text] + other_texts
        vectorizer = TfidfVectorizer(stop_words="english")
        tfidf_matrix = vectorizer.fit_transform(all_texts)

        similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

        scored = list(zip(others, similarities))
        scored.sort(key=lambda x: x[1], reverse=True)
        top = scored[:top_n]

        results = []
        for alumni, score in top:
            results.append(format_alumni(alumni, score, "tfidf"))

        return jsonify({"status": "success", "data": {"recommendations": results, "algorithm": "tfidf_cosine_similarity"}})

    except Exception as e:
        print("Recommendation error:", e)
        return jsonify({"status": "fail", "message": str(e)}), 500


@app.route("/recommend/knn", methods=["POST"])
def recommend_knn():
    """K-Nearest Neighbors"""
    try:
        data = request.json
        user_id = data.get("userId")
        top_n = data.get("topN", 10)

        if not user_id:
            return jsonify({"status": "fail", "message": "userId is required"}), 400

        all_alumni = list(db.alumnis.find({}))
        if len(all_alumni) < 2:
            return jsonify({"status": "success", "data": {"recommendations": []}})

        target = None
        others = []
        for a in all_alumni:
            if str(a.get("user")) == str(user_id):
                target = a
            else:
                others.append(a)

        if not target:
            others = all_alumni

        label_encoders = {}
        query_alumni = target if target else all_alumni[0]
        all_profiles = [query_alumni] + others
        feature_vectors = []
        for p in all_profiles:
            fv = build_feature_vector(p, label_encoders, fit=True)
            feature_vectors.append(list(fv.values()))

        X = np.array(feature_vectors)
        n_neighbors = min(top_n + 1, len(others))

        knn = NearestNeighbors(n_neighbors=n_neighbors, metric="cosine")
        knn.fit(X)

        distances, indices = knn.kneighbors(X[0:1])

        results = []
        for i, idx in enumerate(indices.flatten()):
            if idx == 0:
                continue
            score = round(float(1 - distances.flatten()[i]), 4)
            results.append(format_alumni(others[idx - 1], score, "knn"))

        results = results[:top_n]

        return jsonify({"status": "success", "data": {"recommendations": results, "algorithm": "knn"}})

    except Exception as e:
        print("KNN error:", e)
        return jsonify({"status": "fail", "message": str(e)}), 500


@app.route("/recommend/combined", methods=["POST"])
def recommend_combined():
    """Combined: 50% TF-IDF + 50% KNN"""
    try:
        data = request.json
        user_id = data.get("userId")
        top_n = data.get("topN", 10)

        if not user_id:
            return jsonify({"status": "fail", "message": "userId is required"}), 400

        all_alumni = list(db.alumnis.find({}))
        if len(all_alumni) < 2:
            return jsonify({"status": "success", "data": {"recommendations": []}})

        target = None
        others = []
        for a in all_alumni:
            if str(a.get("user")) == str(user_id):
                target = a
            else:
                others.append(a)

        if not target:
            others = all_alumni

        query_alumni = target if target else all_alumni[0]

        # TF-IDF scores
        target_text = build_profile_text(query_alumni)
        other_texts = [build_profile_text(a) for a in others]
        all_texts = [target_text] + other_texts
        vectorizer = TfidfVectorizer(stop_words="english")
        tfidf_matrix = vectorizer.fit_transform(all_texts)
        tfidf_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

        # KNN scores
        label_encoders = {}
        all_profiles = [query_alumni] + others
        feature_vectors = []
        for p in all_profiles:
            fv = build_feature_vector(p, label_encoders, fit=True)
            feature_vectors.append(list(fv.values()))

        X = np.array(feature_vectors)
        n_neighbors = min(len(others), top_n + 5)
        knn = NearestNeighbors(n_neighbors=n_neighbors, metric="cosine")
        knn.fit(X)
        distances, indices = knn.kneighbors(X[0:1])

        knn_scores = np.zeros(len(others))
        for i, idx in enumerate(indices.flatten()):
            if idx == 0:
                continue
            knn_scores[idx - 1] = 1 - distances.flatten()[i]

        # Normalize both to 0-1 range
        if tfidf_scores.max() > 0:
            tfidf_scores = tfidf_scores / tfidf_scores.max()
        if knn_scores.max() > 0:
            knn_scores = knn_scores / knn_scores.max()

        # Combine: 50/50
        combined_scores = 0.5 * tfidf_scores + 0.5 * knn_scores

        scored = list(zip(others, combined_scores, tfidf_scores, knn_scores))
        scored.sort(key=lambda x: x[1], reverse=True)
        top = scored[:top_n]

        results = []
        for alumni, combined, tfidf, knn in top:
            r = format_alumni(alumni, combined, "combined")
            r["tfidfScore"] = round(float(tfidf), 4)
            r["knnScore"] = round(float(knn), 4)
            results.append(r)

        return jsonify({"status": "success", "data": {"recommendations": results, "algorithm": "combined_50_50"}})

    except Exception as e:
        print("Combined error:", e)
        return jsonify({"status": "fail", "message": str(e)}), 500


def format_alumni(alumni, score, method):
    return {
        "id": str(alumni.get("_id")),
        "userId": str(alumni.get("user")),
        "firstName": alumni.get("firstName", ""),
        "lastName": alumni.get("lastName", ""),
        "branch": alumni.get("branch", ""),
        "degree": alumni.get("degree", ""),
        "endYear": alumni.get("endYear"),
        "company": alumni.get("company", ""),
        "designation": alumni.get("designation", ""),
        "location": alumni.get("location", ""),
        "imageUrl": alumni.get("imageUrl", ""),
        "score": round(float(score), 4),
        "method": method,
    }


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
