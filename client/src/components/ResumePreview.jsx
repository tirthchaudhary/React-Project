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
            margin: 12mm 0;
          }        
          @media print {
            html, body {
              width: 100%;
              height: auto;
              overflow: visible;
            }
            body * {
              visibility: hidden;
            }
            #resume-preview {
              visibility: visible !important;
              position: relative !important;
              left: 0;
              top: 0;
              width: 100%;
              height: auto;
              margin: 0 auto;
              padding: 0;
              box-shadow: none !important;
              border: none !important;
            }
            #resume-preview * {
              visibility: visible !important;
            }
          }  
          `
                }
            </style>
        </div>
    )
}

export default ResumePreview;