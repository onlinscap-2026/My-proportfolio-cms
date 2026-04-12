import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Github, ExternalLink, Search, Filter } from 'lucide-react';
import { trackActivity } from '../lib/analytics';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    trackActivity('PAGE_VIEW', 'PROJECTS');
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/api/projects');
        setProjects(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-16 space-y-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">Projects</h1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-theme">
            A comprehensive list of my professional projects, open-source contributions, and experimental side-projects.
          </p>
        </motion.div>

        <div className="mx-auto flex max-w-md items-center gap-4 rounded-2xl border border-theme bg-card-theme p-2 backdrop-blur-md">
          <div className="flex flex-1 items-center gap-2 px-3">
            <Search size={18} className="text-secondary-theme" />
            <input
              type="text"
              placeholder="Search projects or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-theme outline-none placeholder:text-neutral-600"
            />
          </div>
          <button className="rounded-xl bg-theme p-2 text-secondary-theme hover:text-theme">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[450px] animate-pulse rounded-3xl bg-neutral-900"></div>
          ))
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-theme bg-card-theme transition-all hover:border-neutral-700 hover:bg-neutral-900"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="rounded-lg bg-neutral-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      {tech}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-neutral-400">{project.description}</p>
                <div className="flex items-center gap-6 pt-4 border-t border-neutral-800">
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={() => trackActivity('PROJECT_CLICK', project.title)}
                      className="flex items-center gap-2 text-sm font-bold text-orange-500 hover:text-orange-400"
                    >
                      <ExternalLink size={16} /> Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={() => trackActivity('PROJECT_CLICK', `${project.title} (GitHub)`)}
                      className="flex items-center gap-2 text-sm font-bold text-neutral-400 hover:text-white"
                    >
                      <Github size={16} /> Source Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center text-neutral-500">
            No projects found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
