import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ScrollProgress } from '@/components/motion/scroll-progress';
import { Hero } from '@/components/sections/hero';
import { CapabilityStrip } from '@/components/sections/capability-strip';
import { Services } from '@/components/sections/services';
import { Problems } from '@/components/sections/problems';
import { SelectedWork } from '@/components/sections/selected-work';
import { Process } from '@/components/sections/process';
import { WhyWorkWithMe } from '@/components/sections/why-work-with-me';
import { TechStack } from '@/components/sections/tech-stack';
import { About } from '@/components/sections/about';
import { Contact } from '@/components/sections/contact';
import { getProfile, getServices, getProblems, getSkills, getProjects } from '@/lib/data';
import { DEFAULT_PROFILE } from '@/lib/types';

export const revalidate = 60;

export default async function Home() {
  const [profile, services, problems, skills, projects] = await Promise.all([
    getProfile(),
    getServices(),
    getProblems(),
    getSkills(),
    getProjects(),
  ]);

  const p = profile ?? DEFAULT_PROFILE;

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero profile={p} />
        <CapabilityStrip />
        <Services services={services} />
        <Problems problems={problems} />
        <SelectedWork projects={projects} />
        <Process />
        <WhyWorkWithMe />
        <TechStack skills={skills} />
        <About profile={p} />
        <Contact />
      </main>
      <Footer profile={p} />
    </>
  );
}
