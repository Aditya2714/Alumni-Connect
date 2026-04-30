const Alumni = require("../models/alumniModel");
const { Admin } = require("../models/adminModel");

const buildProfileResponse = (user, profile) => ({
  ...user.toObject(),
  ...(profile ? profile.toObject() : {}),
  id: user._id,
  user: user._id,
  role: user.role,
  email: user.email,
});

const getProfileModel = (role) => {
  if (role === "admin") return Admin;
  if (role === "alumni") return Alumni;
  return null;
};

const buildFileUpdates = (req) => {
  if (!req.file) return {};

  return {
    imageUrl: `http://127.0.0.1:4000/uploads/profiles/${req.file.filename}`,
    fileType: req.file.mimetype,
    originalFileName: req.file.originalname,
  };
};

const getMyProfile = async (req, res) => {
  try {
    const ProfileModel = getProfileModel(req.user.role);
    const profile = ProfileModel ? await ProfileModel.findOne({ user: req.user._id }) : null;

    return res.status(200).json({
      status: "success",
      data: {
        profile: buildProfileResponse(req.user, profile),
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const ProfileModel = getProfileModel(req.user.role);

    if (!ProfileModel) {
      return res.status(400).json({ status: "fail", message: "Profile role is not supported" });
    }

    const allowedUserFields = ["name", "email"];
    const userUpdates = {};
    allowedUserFields.forEach((field) => {
      if (req.body[field] !== undefined) userUpdates[field] = req.body[field];
    });

    if (Object.keys(userUpdates).length) {
      await req.user.constructor.findByIdAndUpdate(req.user._id, userUpdates, {
        runValidators: true,
      });
    }

    const allowedProfileFields =
      req.user.role === "admin"
        ? ["adminName", "email", "password", "imageUrl", "fileType", "originalFileName"]
        : [
            "email",
            "startYear",
            "endYear",
            "degree",
            "branch",
            "rollNumber",
            "firstName",
            "lastName",
            "mobileNumber",
            "imageUrl",
            "fileType",
            "originalFileName",
            "company",
            "designation",
            "location",
            "bio",
            "skills",
            "workExperiences",
            "education",
            "socialProfiles",
          ];

    const profileUpdates = {};
    allowedProfileFields.forEach((field) => {
      if (req.body[field] !== undefined) profileUpdates[field] = req.body[field];
    });

    if (req.body.phone !== undefined) profileUpdates.mobileNumber = req.body.phone;
    Object.assign(profileUpdates, buildFileUpdates(req));

    let profile = await ProfileModel.findOne({ user: req.user._id });
    if (!profile) {
      profile = await ProfileModel.create({
        user: req.user._id,
        email: req.body.email || req.user.email,
        password: req.user.password,
        adminName: req.body.adminName || req.body.name || req.user.name || req.user.email,
        firstName: req.body.firstName || req.user.name || "Alumni",
        startYear: req.body.startYear || 2000,
        endYear: req.body.endYear || 2004,
        degree: req.body.degree || "Not added",
        branch: req.body.branch || "Not added",
        rollNumber: req.body.rollNumber || `ROLL-${req.user._id.toString().slice(-6)}`,
      });
    }

    profile = await ProfileModel.findOneAndUpdate(
      { user: req.user._id },
      profileUpdates,
      { new: true, runValidators: true }
    );
    const updatedUser = await req.user.constructor.findById(req.user._id);

    return res.status(200).json({
      status: "success",
      data: {
        profile: buildProfileResponse(updatedUser, profile),
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ status: "fail", message: error.message || "Internal Server Error" });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};
