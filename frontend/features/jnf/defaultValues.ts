import { additionalSalaryComponentTemplates, programRows } from "@/constants/jnf";
import { JnfFormValues } from "@/features/jnf/schemas";

const makeSalaryComponents = () =>
  additionalSalaryComponentTemplates.map((label) => ({
    label,
    value: "",
    isCustom: false
  }));

export const jnfDefaultValues: JnfFormValues = {
  companyProfile: {
    companyName: "",
    website: "",
    address: "",
    employees: "",
    sector: "",
    logoFile: "",
    orgType: "",
    establishmentDate: "",
    annualTurnover: "",
    linkedInUrl: "",
    industryTags: [],
    hqLocation: "",
    description: ""
  },
  contactDetails: {
    headTa: {
      name: "",
      designation: "",
      email: "",
      mobile: "",
      landline: ""
    },
    primary: {
      name: "",
      designation: "",
      email: "",
      mobile: "",
      landline: ""
    },
    secondary: {
      name: "",
      designation: "",
      email: "",
      mobile: "",
      landline: ""
    }
  },
  jobProfile: {
    jobTitle: "",
    designation: "",
    location: "",
    workMode: "Onsite",
    expectedHires: "",
    minimumHires: "",
    durationMonths: "",
    joiningDate: "",
    skills: [],
    jdContent: "",
    jdPdf: "",
    additionalInfo: "",
    bondAmount: "",
    bondDuration: "",
    deductions: "",
    medicalRequirements: "",
    ppoAvailable: false,
    onboardingInfo: "",
    registrationLink: "https://"
  },
  eligibility: {
    sections: {},
    courses: {}
  },
  salary: {
    currency: "INR",
    sameForAll: true,
    salaryRows: programRows.map((program) => ({
      program,
      ctc: "",
      base: "",
      monthlyTakeHome: ""
    })),
    sharedComponents: makeSalaryComponents(),
    programComponents: programRows.map((program) => ({
      program,
      components: makeSalaryComponents()
    }))
  },
  selectionProcess: {
    stages: [
      {
        stage: "PPT",
        mode: "Offline",
        testType: "",
        duration: "30",
        interviewMode: "",
        notes: ""
      },
      {
        stage: "Resume Shortlist",
        mode: "Online",
        testType: "",
        duration: "45",
        interviewMode: "",
        notes: ""
      }
    ],
    psychometricTest: false,
    medicalTest: false,
    infrastructureNeeds: "",
    otherScreening: ""
  },
  declaration: {
    agreements: [false, false, false, false, false],
    signatoryName: "",
    signatoryDesignation: "",
    signedDate: "",
    typedSignature: ""
  }
};
