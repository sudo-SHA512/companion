import { Framework, FrameworkMeta } from '@/types/framework';
import { iso27001Framework } from './iso27001';
import { tisaxFramework } from './tisax';
import { nis2Framework } from './nis2';

// Framework Registry - add new frameworks here by importing and adding to the array
const frameworkModules: Framework[] = [
  iso27001Framework,
  tisaxFramework,
  nis2Framework,
];

// Build the registry from imported frameworks
export const frameworkRegistry: Record<string, Framework> = {};
frameworkModules.forEach(framework => {
  frameworkRegistry[framework.id] = framework;
});

// Get all available framework metadata (for selection UI)
export const getAvailableFrameworks = (): FrameworkMeta[] => {
  return Object.values(frameworkRegistry).map(fw => ({
    id: fw.id,
    name: fw.name,
    shortName: fw.shortName,
    description: fw.description,
    version: fw.version,
  }));
};

// Get a specific framework by ID
export const getFramework = (id: string): Framework | undefined => {
  return frameworkRegistry[id];
};

// Get multiple frameworks by IDs
export const getFrameworks = (ids: string[]): Framework[] => {
  return ids.map(id => frameworkRegistry[id]).filter(Boolean) as Framework[];
};

// Get all controls from selected frameworks (flattened for audit state)
export const getAllControlsFromFrameworks = (frameworkIds: string[]) => {
  const controls: { frameworkId: string; controlId: string }[] = [];
  
  frameworkIds.forEach(fwId => {
    const framework = frameworkRegistry[fwId];
    if (framework) {
      framework.groups.forEach(group => {
        group.sections.forEach(section => {
          section.controls.forEach(control => {
            controls.push({
              frameworkId: fwId,
              controlId: `${fwId}:${control.id}`,
            });
          });
        });
      });
    }
  });
  
  return controls;
};

// Count total controls in frameworks
export const countTotalControls = (frameworkIds: string[]): number => {
  let count = 0;
  frameworkIds.forEach(fwId => {
    const framework = frameworkRegistry[fwId];
    if (framework) {
      framework.groups.forEach(group => {
        group.sections.forEach(section => {
          count += section.controls.length;
        });
      });
    }
  });
  return count;
};
