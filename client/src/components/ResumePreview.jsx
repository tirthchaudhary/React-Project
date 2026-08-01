import React from "react";
import ModernTemplate from '../../assets/templates/ModernTemplate.jsx'
import ClassicTemplate from '../../assets/templates/ClassicTemplate.jsx'
import MinimalImageTemplate from '../../assets/templates/MinimalImageTemplate.jsx'
import MinimalTemplate from '../../assets/templates/MinimalTemplate.jsx'


const ResumePreview = ({ data, template, accentColor, classes = "" }) => {

    const renderemplate = () => {
        switch (template) {
            case "modern":
                return <ModernTemplate data={data} accentColor={accentColor} />
            case "minimal":
                return <MinimalTemplate data={data} accentColor={accentColor} />
            case "minimal-image":
                return <MinimalImageTemplate data={data} accentColor={accentColor} />

            default:
                return <ClassicTemplate data={data} accentColor={accentColor} />
        }
    }

    return (
        <div className="w-full bg-gray-100">
            <div id="resume-preview" className={"border border-gray-200 print:shadow-none print:border-none " + classes}>
                {renderemplate()}
            </div>
            <style jsx>
                {
                    `
          @page {
            size: letter;
            margin: 15mm 12mm;
          }        
          @media print {
            html, body {
              width: 100% !important;
              height: auto !important;
              overflow: visible !important;
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
            }
            div, main, section, article {
              position: static !important;
              transform: none !important;
            }
            body * {
              visibility: hidden;
            }
            #resume-preview, #resume-preview * {
              visibility: visible !important;
            }
            #resume-preview {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              border: none !important;
              background: #ffffff !important;
              box-sizing: border-box !important;
            }
          }  
          `
                }
            </style>
        </div>
    )
}

export default ResumePreview;