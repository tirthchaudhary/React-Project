import React, { useEffect, useState } from "react";
import { useParams, Link, data } from "react-router-dom"; // 
import { dummyResumeData } from "../../assets/assets.js";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2Icon,
  Sparkles,
  User,
} from "lucide-react";
import PersonalInfo from "../components/PersonalInfo";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker.jsx";
import ProfSummary from "../components/profSummary.jsx";
import ExperienceForm from "../components/ExperienceForm.jsx";
import EducationForm from "../components/EducationForm.jsx";
import ProjectForm from "../components/ProjectForm.jsx";
import SkillsForm from "../components/SkillsForm.jsx";
import { useSelector } from "react-redux";
import api from "../config/api.js";
import toast from "react-hot-toast";
import html2pdf from "html2pdf.js";

const ResumeBuilder = () => {

    const { resumeId } = useParams();

    const {token}=useSelector(state=>state.auth)

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    projects: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  });

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];


  const loadExistingResume = async () => {
    try {
      const {data}=await api.get(`/api/resumes/get/${resumeId}`,{headers:{Authorization:token}})
      if (data.resume) {
        const projectsList = data.resume.projects || data.resume.project || [];
        setResumeData({
          ...data.resume,
          projects: projectsList,
          project: projectsList,
        });
        document.title=data.resume.title;
      }
    } catch (error) {
       console.log(error.message);
    }
  };

  const handlePersonalInfoChange = (updatedPersonalInfo) => {
    setResumeData((prev) => ({
      ...prev,
      personal_info: updatedPersonalInfo,
    }));
  };

  useEffect(() => {
    loadExistingResume();
  }, []);

    const changeResumeVisibility=async ()=>{
      try {
       const formData = new FormData()
       formData.append("resumeId",resumeId);
       formData.append("resumeData",JSON.stringify({public:!resumeData.public}));

       const {data}=await api.put('/api/resumes/update',formData,{headers:{Authorization:token}});

       setResumeData({...resumeData,public:!resumeData.public});
       toast.success(data.message);
      } catch (error) {
        console.error(error);
      }
    }

    const handleShare=()=>{
      const frontendUrl=window.location.href.split('/app')[0];
      const resumeUrl=frontendUrl+'/view/'+resumeId;

      if(navigator.share){
        navigator.share({url:resumeUrl,text:"My Resume"});
      }else{
        alert("Share is nnot supported on this browser.");
      }
    }

    const downloadReume=async ()=>{
      const element = document.getElementById("resume-preview");
      if (!element) {
        window.print();
        return;
      }
      try {
        const opt = {
          margin: [10, 10, 10, 10],
          filename: `${resumeData.title || "Resume"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["css", "legacy"] }
        };
        await toast.promise(html2pdf().set(opt).from(element).save(), {
          loading: "Generating PDF...",
          success: "Downloaded PDF successfully!",
          error: "Could not generate PDF",
        });
      } catch (error) {
        console.error("PDF generation error:", error);
        window.print();
      }
    }

    const saveResume=async ()=>{
       try {
          let updateResumeData=structuredClone(resumeData)
          
          if (typeof resumeData.personal_info.image==='object') {
             delete updateResumeData.personal_info.image
          }

          const projectsList = updateResumeData.projects || updateResumeData.project || [];
          updateResumeData.projects = projectsList;
          updateResumeData.project = projectsList;

          const formData=new FormData();
           
          formData.append("resumeId",resumeId);
           formData.append('resumeData',JSON.stringify(updateResumeData));
     if (removeBackground) {
      formData.append("removeBackground", "yes");
    }

    if (typeof resumeData.personal_info.image === "object") {
      formData.append("image", resumeData.personal_info.image);
    }

          const {data}=await api.put('/api/resumes/update',formData,{headers:{Authorization:token}})
          const savedProjects = data.resume.projects || data.resume.project || [];
          setResumeData({
            ...data.resume,
            projects: savedProjects,
            project: savedProjects,
          });
          toast.success(data.message);
       } catch (error) {
         console.error("error saving resume:",error);
       }
    }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to="/app"
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Panel - Form */}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
              {/* Progress bar using activeSectionIndex */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-500"
                style={{
                  width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                }}
              />

              {/* Section Navigation */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                <div className="flex items-center gap-2"> 
                <TemplateSelector selectedTemplate={resumeData.template} onChange={(template)=>setResumeData(prev=>({...prev,template:template}))}/> 
                <ColorPicker selectedColor={resumeData.accent_color} onChange={(color)=>setResumeData((prev)=>({...prev,accent_color:color}))}/>
                </div>
                <div className="flex items-center">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex((prev) => Math.max(0, prev - 1))
                      }
                      className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                      disabled={activeSectionIndex === 0}
                    >
                      <ChevronLeft className="size-4" /> Previous
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setActiveSectionIndex((prev) =>
                        Math.min(sections.length - 1, prev + 1)
                      )
                    }
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${
                      activeSectionIndex === sections.length - 1
                        ? "opacity-50"
                        : ""
                    }`}
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    <ChevronRight className="size-4" /> Next
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="space-y-6">
                {activeSection.id === "personal" && (
                  <PersonalInfo
                    data={resumeData.personal_info} // 
                    onChange={handlePersonalInfoChange}
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}
                {activeSection.id === "summary" &&(
                  <ProfSummary data={resumeData.professional_summary} setResumeData={setResumeData} onChange={(data)=>setResumeData(prev=>({...prev,professional_summary:data}))}/>
                )}
                {activeSection.id==='experience'&&(
                  <ExperienceForm data={resumeData.experience} onChange={(data)=>setResumeData(prev=>({...prev,experience:data}))}/>
                )}
                {activeSection.id==='education'&&(
                  <EducationForm data={resumeData.education} onChange={(data)=>setResumeData(prev=>({...prev,education:data}))}/>
                )}   
                {activeSection.id==='projects' &&(
                  <ProjectForm data={resumeData.projects || resumeData.project || []} onChange={(data)=>setResumeData((prev)=>({...prev,projects:data,project:data}))}/>
                )}         
                {activeSection.id==='skills' &&(
                  <SkillsForm data={resumeData.skills} onChange={(data)=>setResumeData((prev)=>({...prev,skills:data}))}/>
                )}    
              </div>
              <button onClick={()=>{toast.promise(saveResume(),{loading:'Saving...'})}} className="bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-500 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm">
                Save Changes
                </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-7 mx-lg:mt-6">
             <div className="relative w-full">
              {/*-----buttons----*/}
             <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">
                {resumeData.public &&(
                  <button onClick={handleShare} className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors">
                    <Share2Icon className="size-4"/> Share
                  </button>
                )}
                  <button onClick={changeResumeVisibility} className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600  ring-purple-300 rounded-lg hover:ring transition-colors">
                  {resumeData.public ? <EyeIcon className="size-4"/>:<EyeOffIcon className="size-4"/>}
                  {resumeData.public?'public':'private'}
                </button>
                  <button onClick={downloadReume} className="flex items-center px-6 py-2 gap-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors">
                  <DownloadIcon className="size-4"/>
                  Download
                 </button>
             </div>


             </div>
             <div>
              {/*----resume preview----*/}
              <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color}/>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
