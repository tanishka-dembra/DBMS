import { z } from "zod";

const courseEntrySchema = z.object({
  branchId: z.number().optional(),
  selected: z.boolean(),
  branch: z.string(),
  department: z.string().optional(),
  cgpa: z.string().optional().or(z.literal("")),
  backlogsAllowed: z.boolean(),
  majorSelected: z.boolean().optional(),
  minorSelected: z.boolean().optional(),
  minorCgpa: z.string().optional().or(z.literal(""))
});

const salaryEntrySchema = z.object({
  program: z.string(),
  ctc: z.string().min(1, "CTC is required"),
  base: z.string().min(1, "Base/Fixed salary is required"),
  monthlyTakeHome: z.string().min(1, "In-hand salary is required")
});

const salaryComponentSchema = z.object({
  label: z.string(),
  value: z.string(),
  isCustom: z.boolean()
});

const salaryProgramComponentSchema = z.object({
  program: z.string(),
  components: z.array(salaryComponentSchema)
});

const selectionRoundSchema = z.object({
  stage: z.string(),
  mode: z.string(),
  testType: z.string().optional(),
  duration: z.string(),
  interviewMode: z.string().optional(),
  notes: z.string().optional()
});

const eligibilitySectionSchema = z.object({
  cgpa: z.string().optional().or(z.literal("")),
  backlogsAllowed: z.boolean(),
  gender: z.string().optional(),
  highSchoolPercentage: z.string().optional().or(z.literal("")),
  slpRequirement: z.string().optional().or(z.literal("")) 
});

const contactEntrySchema = z.object({
  name: z.string().min(2, "Full name is required"),
  designation: z.string().min(2, "Designation is required"),
  email: z.string().email("Enter a valid email"),
  mobile: z.string().min(10, "Mobile number is required"),
  landline: z.string().optional()
});

const optionalContactEntrySchema = z.object({
  name: z.string().optional(),
  designation: z.string().optional(),
  email: z.string().optional(),
  mobile: z.string().optional(),
  landline: z.string().optional()
});

export const jnfSchema = z.object({
  companyProfile: z.object({
    companyName: z.string().min(2, "Company name is required"),
    website: z.string().url("Enter a valid website"),
    address: z.string().min(10, "Address is required"),
    employees: z.string().min(1, "Employee count is required"),
    sector: z.string().min(2, "Sector is required"),
    logoFile: z.string().min(1, "Company logo is required"),
    orgType: z.string().min(1, "Organisation type is required"),
    establishmentDate: z.string().min(1, "Date of establishment is required"),
    annualTurnover: z.string().min(1, "Annual turnover is required"),
    linkedInUrl: z.string().url("Enter a valid LinkedIn URL"),
    industryTags: z.array(z.string()).min(1, "Add at least one industry tag"),
    hqLocation: z.string().min(2, "HQ location is required"),
    description: z.string().min(30, "Description should be more detailed")
  }),
  contactDetails: z.object({
    headTa: contactEntrySchema,
    primary: contactEntrySchema,
    secondary: optionalContactEntrySchema
  }),
  jobProfile: z.object({
    jobTitle: z.string().min(2, "Job title is required"),
    designation: z.string().min(2, "Designation is required"),
    location: z.string().min(2, "Location is required"),
    workMode: z.string().min(1, "Work mode is required"),
    expectedHires: z.string().min(1, "Expected hires is required"),
    minimumHires: z.string().min(1, "Minimum hires is required"),
    durationMonths: z.string().optional(),
    joiningDate: z.string().min(1, "Joining date is required"),
    skills: z.array(z.string()).min(1, "Add at least one skill"),
    jdContent: z.string().min(20, "Job description is required"),
    jdPdf: z.string().optional(),
    additionalInfo: z.string().optional(),
    bondAmount: z.string().optional(),
    bondDuration: z.string().optional(),
    deductions: z.string().optional(),
    medicalRequirements: z.string().optional(),
    ppoAvailable: z.boolean().optional(),
    onboardingInfo: z.string().optional(),
    registrationLink: z.string().url("Enter a valid registration link")
  }),
  eligibility: z.object({
    sections: z.record(eligibilitySectionSchema),
    courses: z.record(z.array(courseEntrySchema))
  }),
  salary: z.object({
    currency: z.string().min(1, "Currency is required"),
    sameForAll: z.boolean(),
    salaryRows: z.array(salaryEntrySchema),
    sharedComponents: z.array(salaryComponentSchema),
    programComponents: z.array(salaryProgramComponentSchema)
  }),
  selectionProcess: z.object({
    stages: z.array(selectionRoundSchema).min(2, "Add at least two stages"),
    psychometricTest: z.boolean(),
    medicalTest: z.boolean(),
    infrastructureNeeds: z.string().optional(),
    otherScreening: z.string().optional()
  }),
  declaration: z.object({
    agreements: z.array(z.boolean()).refine((value) => value.every(Boolean), "Accept all declarations"),
    signatoryName: z.string().min(2, "Signatory name is required"),
    signatoryDesignation: z.string().min(2, "Signatory designation is required"),
    signedDate: z.string().min(1, "Date is required"),
    typedSignature: z.string().min(2, "Typed signature is required")
  })
}).superRefine((data, ctx) => {
  Object.entries(data.eligibility.courses).forEach(([courseKey, rows]) => {
    rows.forEach((row, index) => {
      const isSelected = Boolean(row.selected || row.majorSelected || row.minorSelected);

      if (!isSelected) {
        return;
      }


      
    });
  });
});

export type JnfFormValues = z.infer<typeof jnfSchema>;
