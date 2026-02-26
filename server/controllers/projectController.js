const Project = require("../models/Project");

// @desc Create a new project
// @route POST /api/projects
const createProject = async (req, res) => {
    try {
        // step 1 - get data from request body
        const { title, description, techStack, status, githubLink, liveLink } = req.body;

        // step 2 - check required fields 
        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }

        // step 3 - get thumbnail path if uploaded
        const thumbnail = req.file ? `/uploads/${req.file.filename}` : "";

        // step 4 - handle techStack (comes as string from form , convert to array)
        const techStackArray = Array.isArray(techStack)
        ? techStack
        : techStack ? techStack.split(",").map((t) => t.trim()) : [];

        // step 5 - create project in MongoDB
        const project = await Project.create({
            user: req.user.id, // comes from authMiddleware
            title,
            description,
            techStack: techStackArray,
            status: status || "In Progress",
            githubLink: githubLink ?? "",
            liveLink: liveLink ?? "",
            thumbnail,
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get all projects of logged in user (with search & filter)
// @route GET/api/projects
const getProjects = async (req, res) => {
    try {
        // step 1 - get search and filter values from query params
        const { search, status } = req.query;

        // step 2 - build query object
        let query = { user: req.user.id }; // only fetch THIS user's projects

        // step 3 - if search exists, add search condition
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } }, // search in title
                { techStack: { $regex: search, $options: "i" } }, // search in techStack
            ];
        }

        // step 4 - if status filter exists, add it to query
        if (status && status !== "All") {
            query.status = status;
        }

        // step 5 - fetch projects form MongoDB
        const projects = await Project.find(query).sort({ createdAt: -1 });

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc get single project
// @route GET /api/projects/:id
const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        // check if project exists
        if(!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // check if this project belongs to logged in user
        if(project.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc update project
// @route PUT / api/projects/:id
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" })
    }

    // handle techStack
    let techStackArray = project.techStack
    if (req.body.techStack) {
      techStackArray = Array.isArray(req.body.techStack)
        ? req.body.techStack
        : req.body.techStack.split(",").map((t) => t.trim()).filter(t => t)
    }

    // update fields
    project.title = req.body.title || project.title
    project.description = req.body.description || project.description
    project.techStack = techStackArray
    project.status = req.body.status || project.status
    project.githubLink = req.body.githubLink !== undefined ? req.body.githubLink : project.githubLink
    project.liveLink = req.body.liveLink !== undefined ? req.body.liveLink : project.liveLink

    // only update thumbnail if new file uploaded
    if (req.file) {
      project.thumbnail = `/uploads/${req.file.filename}`
    }

    const updatedProject = await project.save()
    res.status(200).json(updatedProject)

  } catch (error) {
    console.log('Update error:', error.message)
    res.status(500).json({ message: error.message })
  }
};

// @desc delete project
// @route DELETE / api/projects/:id
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if(!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // check if this project belongs to logged in user
        if (project.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized " });
        }

        await project.deleteOne();
        res.status(200).json({ message: "Project deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createProject, getProjects, getProject, updateProject, deleteProject };