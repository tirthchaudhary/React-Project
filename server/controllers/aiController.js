import ai from "../config/ai.js";
import Resume from "../model/resume.js";


const createCompletion = async (messages, responseFormat = null) => {
  const modelCandidates = [
    process.env.GEMINI_MODEL || process.env.OPENAI_MODEL || "gemini-flash-latest",
    "gemini-flash-latest",
    "gemini-2.5-flash",
    "gemini-flash-lite-latest"
  ];
  // Deduplicate array preserving order
  const uniqueModels = [...new Set(modelCandidates)];

  let lastError = null;
  for (const model of uniqueModels) {
    try {
      const params = { model, messages };
      if (responseFormat) params.response_format = responseFormat;
      return await ai.chat.completions.create(params);
    } catch (err) {
      lastError = err;
      console.warn(`Model ${model} failed (status: ${err.status}). Trying next model...`);
    }
  }
  throw lastError;
};

// controller for enhancing a resume's professional summary
// POST: /api/ai/enhance-pro-sum

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await createCompletion([
      {
        role: "system",
        content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else."
      },
      {
        role: "user",
        content: userContent,
      },
    ]);

    const enhancedContent = response.choices[0].message.content;

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("Enhance pro summary error:", error);
    let msg = error.message || "Failed to enhance summary";
    if (error.status === 429 || msg.includes("429") || msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("quota")) {
      msg = "AI rate limit or quota exceeded. Please wait a minute before trying again or verify your API key.";
    }
    res.status(500).json({ message: msg });
  }
};

// controller for enhancing a resume's job description
// POST: /api/ai/enhance-job-desc

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await createCompletion([
      {
        role: "system",
        content: "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be 1-2 sentences also highlighting key responsibilities and achievements. Make it compelling and ATS-friendly. and only return text no options or anything else."
      },
      {
        role: "user",
        content: userContent,
      },
    ]);

    const enhancedContent = response.choices[0].message.content;

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("Enhance job description error:", error);
    let msg = error.message || "Failed to enhance job description";
    if (error.status === 429 || msg.includes("429") || msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("quota")) {
      msg = "AI rate limit or quota exceeded. Please wait a minute before trying again or verify your API key.";
    }
    res.status(500).json({ message: msg });
  }
};

function normalizeResumeData(data) {
  if (typeof data.skills == 'string') {
    data.skills = data.skills.split(",").map(s => s.trim()).filter(Boolean);
  } else if (!Array.isArray(data.skills)) {
    data.skills = [];
  }
  if (!Array.isArray(data.experience)) data.experience = [];
  data.experience = data.experience.map(exp => ({
    company: exp.company || "",
    position: exp.position || "",
    start_date: exp.start_date || "",
    end_date: exp.end_date || "",
    description: exp.description || "",
    is_current: Boolean(exp.is_current)
  }));
  if (!Array.isArray(data.education)) {
    data.education = [];
  } else {
    data.education = data.education.map(edu => ({
      institution: edu.institution || "",
      degree: edu.degree || "",
      field: edu.field || "",
      graduation_date: edu.graduation_date || "",
      gpa: edu.gpa || ""
    }));
  }

  // Ensure projects is an array
  if (!Array.isArray(data.projects)) {
    data.projects = [];
  } else {
    data.projects = data.projects.map(proj => ({
      name: proj.name || "",
      type: proj.type || "",
      description: proj.description || ""
    }));
  }


  data.personal_info = {
    full_name: data.personal_info?.full_name || "",
    profession: data.personal_info?.profession || "",
    email: data.personal_info?.email || "",
    phone: data.personal_info?.phone || "",
    location: data.personal_info?.location || "",
    linkedin: data.personal_info?.linkedin || "",
    website: data.personal_info?.website || ""
  };
  data.professional_summary = data.professional_summary || "";
  return data;
}

// controller for uploading a resume to the database
// POST: /api/ai/upload-resume

export const uploadResume = async (req, res) => {

  try {

    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) parser and resume data extraction AI.
Your job is to parse unorganized, unstructured, or potentially multi-column scrambled resume text into a structured JSON format.`;
    const userPrompt = `Extract all details from the following resume text:
---BEGIN RESUME TEXT---
${resumeText}
---END RESUME TEXT---
Instructions:
1. Handle non-standard section headers (e.g., map 'Work History', 'Career Track', or 'Employment' to 'experience', map 'Tech Stack' or 'Competencies' to 'skills').
2. If text appears scrambled from multi-column PDFs, reassemble logically related information.
3. Extract clean dates (e.g., 'Jan 2020 - Present' or '2018 - 2021').
4. Always output ONLY valid JSON matching this exact structure:
{
  "professional_summary": "",
  "skills": [],
  "personal_info": {
    "full_name": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "description": "",
      "is_current": false
    }
  ],
  "projects": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduation_date": "",
      "gpa": ""
    }
  ]
}`;

    const response = await createCompletion(
      [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      { type: 'json_object' }
    );

    let extractedData = response.choices[0].message.content;
    // Remove markdown codeblock tags if AI wraps response in ```json ... ```
    extractedData = extractedData.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    const parseData = JSON.parse(extractedData);
    const cleanedData = normalizeResumeData(parseData);
    const newResume = await Resume.create({ userId, title, ...cleanedData });


    res.status(200).json({ resumeId: newResume._id })
  } catch (error) {
    console.error("Upload resume error:", error);
    res.status(400).json({ message: error.message })
  }
}