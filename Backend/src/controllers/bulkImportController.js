const multer = require("multer");
const Alumni = require("../models/alumniModel");
const User = require("../models/user");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const isCsv =
      file.mimetype === "text/csv" ||
      file.originalname.toLowerCase().endsWith(".csv");

    if (!isCsv) {
      return cb(new Error("Please upload a CSV file. Export Excel or Google Forms data as CSV first."));
    }

    cb(null, true);
  },
}).single("file");

const parseCsv = (content) => {
  const rows = [];
  let current = "";
  let row = [];
  let insideQuotes = false;

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    const nextChar = content[index + 1];

    if (char === "\"" && insideQuotes && nextChar === "\"") {
      current += "\"";
      index += 1;
    } else if (char === "\"") {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      row.push(current.trim());
      current = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") index += 1;
      row.push(current.trim());
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      current = "";
    } else {
      current += char;
    }
  }

  if (current || row.length) {
    row.push(current.trim());
    if (row.some((value) => value !== "")) rows.push(row);
  }

  return rows;
};

const normalizeHeader = (header) =>
  header
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const getValue = (row, headerMap, names) => {
  for (const name of names) {
    const index = headerMap[normalizeHeader(name)];
    if (index !== undefined && row[index] !== undefined) return row[index].trim();
  }
  return "";
};

const bulkImport = (req, res) => {
  upload(req, res, async (error) => {
    try {
      if (error) {
        return res.status(400).json({ status: "fail", message: error.message });
      }

      if (!req.file) {
        return res.status(400).json({ status: "fail", message: "CSV file is required" });
      }

      if (req.user?.role !== "admin") {
        return res.status(403).json({ status: "fail", message: "Only admin can bulk import alumni" });
      }

      const rows = parseCsv(req.file.buffer.toString("utf-8"));
      if (rows.length < 2) {
        return res.status(400).json({ status: "fail", message: "CSV must contain a header row and at least one data row" });
      }

      const headers = rows[0];
      const headerMap = headers.reduce((map, header, index) => {
        map[normalizeHeader(header)] = index;
        return map;
      }, {});

      const summary = {
        imported: 0,
        skipped: 0,
        errors: [],
      };

      for (const [rowIndex, row] of rows.slice(1).entries()) {
        const lineNumber = rowIndex + 2;
        const email = getValue(row, headerMap, ["email", "email address", "mail"]);
        const firstName = getValue(row, headerMap, ["firstName", "first name", "name"]);
        const lastName = getValue(row, headerMap, ["lastName", "last name"]);
        const password = getValue(row, headerMap, ["password"]) || "alumni123";
        const startYear = getValue(row, headerMap, ["startYear", "start year"]);
        const endYear = getValue(row, headerMap, ["endYear", "end year", "batch", "passing year"]);
        const degree = getValue(row, headerMap, ["degree", "course"]);
        const branch = getValue(row, headerMap, ["branch", "department"]);
        const rollNumber =
          getValue(row, headerMap, ["rollNumber", "roll number", "usn", "student id"]) ||
          `ROLL-${Date.now()}-${lineNumber}`;
        const company = getValue(row, headerMap, ["company", "current company"]);
        const designation = getValue(row, headerMap, ["designation", "role", "job title"]);
        const location = getValue(row, headerMap, ["location", "city"]);

        if (!email || !firstName || !startYear || !endYear || !degree || !branch) {
          summary.skipped += 1;
          summary.errors.push({
            line: lineNumber,
            reason: "Missing required fields",
          });
          continue;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          summary.skipped += 1;
          summary.errors.push({
            line: lineNumber,
            email,
            reason: "Email already exists",
          });
          continue;
        }

        const user = await User.create({
          name: [firstName, lastName].filter(Boolean).join(" "),
          email,
          password,
          role: "alumni",
          isApproved: true,
          approvalStatus: "approved",
        });

        await Alumni.create({
          user: user._id,
          email,
          password,
          startYear,
          endYear,
          degree,
          branch,
          rollNumber,
          firstName,
          lastName,
          company,
          designation,
          location,
        });

        summary.imported += 1;
      }

      return res.status(201).json({
        status: "success",
        message: "Bulk import completed",
        data: summary,
      });
    } catch (importError) {
      console.error("Bulk import failed:", importError);
      return res.status(500).json({
        status: "fail",
        message: importError.message || "Internal Server Error",
      });
    }
  });
};

module.exports = { bulkImport };
