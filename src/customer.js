import {clean,lines,selected,requireText,number,pence,pounds,section,report,enumValue,webAddress} from './customer-ui.js';
export const config = {
  "title": "Accountancy Website Content Planner",
  "short": "Explain your practice with confidence",
  "audience": "For accountants and practice managers",
  "summary": "Choose the clients and services that matter to your practice, then create a focused brief for your website content.",
  "button": "Prepare my content brief",
  "filename": "accountancy-website-brief",
  "eyebrow": "A considered plan for your practice.",
  "time": "About 5 minutes",
  "outcome": "A service-led content brief, with useful questions to answer before writing.",
  "layout": "editorial",
  "intro": "You know your clients and how your practice works. This turns that knowledge into a useful starting point for your website.",
  "note": "This is a website planning tool. It does not provide tax or accountancy advice, or invent credentials for your practice.",
  "fields": [
    {
      "id": "business",
      "label": "Practice name",
      "help": "",
      "required": true,
      "type": "text",
      "maxLength": 180
    },
    {
      "id": "clients",
      "label": "Who do you most want to hear from?",
      "options": [
        "Sole traders",
        "Limited companies",
        "Landlords",
        "Start-ups",
        "Established employers"
      ],
      "help": "",
      "type": "checks",
      "wide": true
    },
    {
      "id": "services",
      "label": "Which services will the website explain?",
      "options": [
        "Annual accounts",
        "Bookkeeping",
        "Payroll",
        "Tax returns",
        "VAT support",
        "Management accounts"
      ],
      "help": "",
      "type": "checks",
      "wide": true
    },
    {
      "id": "approach",
      "label": "What should prospective clients know about working with you?",
      "help": "Describe your actual approach, contact arrangements or onboarding process.",
      "required": true,
      "type": "textarea",
      "maxLength": 2500,
      "wide": true
    },
    {
      "id": "evidence",
      "label": "What can you substantiate?",
      "help": "Optional. Verified qualifications, memberships, approved testimonials or relevant experience.",
      "required": false,
      "type": "textarea",
      "maxLength": 2500,
      "wide": true
    },
    {
      "id": "action",
      "label": "What should a suitable visitor do next?",
      "options": [
        "Book an introductory conversation",
        "Request a fee proposal",
        "Send an initial enquiry"
      ],
      "help": "",
      "required": true,
      "type": "select"
    }
  ],
  "example": {
    "business": "Example Accountancy Practice",
    "clients": [
      "Limited companies",
      "Start-ups"
    ],
    "services": [
      "Annual accounts",
      "Payroll"
    ],
    "approach": "An initial conversation, agreed scope in writing and a named practice contact.",
    "evidence": "Add only qualifications and memberships the practice has verified.",
    "action": "Book an introductory conversation"
  }
};
export function evaluate(v){const clients=selected(v.clients),services=selected(v.services);if(!clients.length||!services.length)throw Error('Choose at least one client type and one service.');const prompts={'Annual accounts':'Explain what you need from the client, how the timetable is agreed and what is included.','Bookkeeping':'Explain how records are shared, how often work is done and who answers queries.','Payroll':'Explain the employee information needed, deadlines and how changes are reported.','Tax returns':'Explain the information gathering process, agreed responsibilities and review before submission.','VAT support':'Explain the records and authorisation needed, without making a blanket tax recommendation.','Management accounts':'Explain reporting frequency, the reports supplied and how a review meeting works.'};return report(requireText(v.business,'your practice name')+': content brief','A focused outline for a website writer or designer.',[section('The clients we want to reach',clients),section('Explain each selected service',services.map(s=>s+': '+(prompts[s]||'Confirm the actual scope and client responsibilities.'))),section('Working with the practice',[requireText(v.approach,'your practice approach'),'Next step: '+requireText(v.action,'the next step for visitors')]),section('Evidence to prepare',lines(v.evidence).length?lines(v.evidence):['Gather verified qualifications, membership details and any approved client comments before using them.']),section('Keep the brief useful',['State what is included in a service and when a separate quote is needed.','Ask the practice to approve the final explanations and any professional claims.','Use a short initial enquiry form. Request detailed financial information through the practice’s agreed secure process.'])]);}
