import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  getExperience,
  getEducation,
  getSkills,
  getSiteConfig,
} from "@/lib/data";
import type { Experience, Education } from "@/types/experience";
import type { SkillCategory } from "@/types/site";
import { CVHeader } from "./CVHeader";
import { CVSection } from "./CVSection";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Courier",
    fontSize: 9,
    paddingTop: 45,
    paddingBottom: 45,
    paddingLeft: 45,
    paddingRight: 45,
    backgroundColor: "#ffffff",
    color: "#1a1a25",
    lineHeight: 1.4,
  },
  expEntry: { marginBottom: 8 },
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  expCompany: { fontFamily: "Courier-Bold", fontSize: 9, color: "#1a1a25" },
  expDates: { fontFamily: "Courier", fontSize: 8, color: "#6b6b80" },
  expRole: {
    fontFamily: "Courier",
    fontSize: 9,
    color: "#45455a",
    marginBottom: 2,
  },
  expDesc: {
    fontFamily: "Courier",
    fontSize: 8,
    color: "#45455a",
    marginBottom: 3,
  },
  achievement: {
    fontSize: 8,
    color: "#45455a",
    marginLeft: 8,
    marginBottom: 1,
  },
  skillRow: { flexDirection: "row", marginBottom: 3, flexWrap: "wrap" },
  skillCategory: {
    fontFamily: "Courier-Bold",
    fontSize: 8,
    color: "#1a1a25",
    marginRight: 6,
    width: 80,
  },
  skillList: { fontFamily: "Courier", fontSize: 8, color: "#45455a", flex: 1 },
  eduEntry: { marginBottom: 4 },
  eduHeader: { flexDirection: "row", justifyContent: "space-between" },
  eduInstitution: {
    fontFamily: "Courier-Bold",
    fontSize: 9,
    color: "#1a1a25",
  },
  eduDates: { fontFamily: "Courier", fontSize: 8, color: "#6b6b80" },
  eduDegree: { fontFamily: "Courier", fontSize: 8, color: "#45455a" },
  qrFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#c8c8d0",
    borderTopStyle: "solid",
  },
  qrImage: { width: 80, height: 80, marginRight: 10 },
  qrLabel: { fontFamily: "Courier", fontSize: 8, color: "#6b6b80" },
});

function formatDate(isoMonth: string): string {
  if (!isoMonth) return "";
  const [year, month] = isoMonth.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export function CVDocument({ qrDataUrl }: { qrDataUrl: string }) {
  const experience = getExperience();
  const education = getEducation();
  const skills = getSkills();
  const site = getSiteConfig();
  const { owner, social } = site;

  return (
    <Document title={`${owner.name} — CV`} author={owner.name}>
      <Page size="A4" style={styles.page}>
        <CVHeader
          name={owner.name}
          title={owner.title}
          email={owner.email}
          github={social.github}
          linkedin={social.linkedin}
        />

        <CVSection title="Experience">
          {experience.map((exp: Experience, i: number) => (
            <View key={i} style={styles.expEntry}>
              <View style={styles.expHeader}>
                <Text style={styles.expCompany}>{exp.company}</Text>
                <Text style={styles.expDates}>
                  {formatDate(exp.startDate)} —{" "}
                  {exp.isCurrent ? "Present" : formatDate(exp.endDate ?? "")}
                </Text>
              </View>
              <Text style={styles.expRole}>{exp.title}</Text>
              <Text style={styles.expDesc}>{exp.description}</Text>
              {exp.achievements.map((a: string, j: number) => (
                <Text key={j} style={styles.achievement}>
                  • {a}
                </Text>
              ))}
            </View>
          ))}
        </CVSection>

        <CVSection title="Skills">
          {skills.map((cat: SkillCategory, i: number) => (
            <View key={i} style={styles.skillRow}>
              <Text style={styles.skillCategory}>{cat.category}</Text>
              <Text style={styles.skillList}>
                {cat.skills.map((s) => s.name).join(", ")}
              </Text>
            </View>
          ))}
        </CVSection>

        <CVSection title="Education">
          {education.map((edu: Education, i: number) => (
            <View key={i} style={styles.eduEntry}>
              <View style={styles.eduHeader}>
                <Text style={styles.eduInstitution}>{edu.institution}</Text>
                <Text style={styles.eduDates}>
                  {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                </Text>
              </View>
              <Text style={styles.eduDegree}>
                {edu.degree}, {edu.field}
              </Text>
            </View>
          ))}
        </CVSection>

        <View style={styles.qrFooter}>
          <Image src={qrDataUrl} style={styles.qrImage} />
          <Text style={styles.qrLabel}>Scan to view live portfolio</Text>
        </View>
      </Page>
    </Document>
  );
}
