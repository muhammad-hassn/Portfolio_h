import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ScrollProgress } from '@/components/motion/scroll-progress';
import { Hero } from '@/components/sections/hero';
import { SelectedWork } from '@/components/sections/selected-work';
import { Capabilities } from '@/components/sections/capabilities';
import { TechStack } from '@/components/sections/tech-stack';
import { Process } from '@/components/sections/process';
import { Contact } from '@/components/sections/contact';
import { getProfile, getSkills, getProjects, getServices } from '@/lib/data';
import { DEFAULT_PROFILE } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const [profile, skills, projects, services] = await Promise.all([
    getProfile(),
    getSkills(),
    getProjects(),
    getServices(),
  ]);

  const p = profile ?? DEFAULT_PROFILE;

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="relative flex flex-col min-h-screen">
        <Hero profile={p} />
        <SelectedWork projects={projects} />
        <Capabilities services={services} />
        <TechStack skills={skills} />
        <Process />
        <Contact profile={p} />
      </main>
      <Footer profile={p} />
    </>
  );
}
