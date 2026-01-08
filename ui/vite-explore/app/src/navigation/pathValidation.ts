// src/navigation/pathValidation.ts

import { ROUTE_PATTERNS } from './paths';

/**
 * Generate formatted documentation of all app routes
 */
function generateDocs() {
   console.log('\n====================');
   console.log(' Application Routes ');
   console.log('====================\n');
  
   Object.entries(ROUTE_PATTERNS).forEach(([moduleName, patterns]) => {
      if (typeof patterns === 'string') {
         console.log(`${moduleName}: \`${patterns}\``);
         return;
      } 
      
      console.log(`\n## ${moduleName}\n`);

      Object.entries(patterns).forEach(([name, pattern]) => {
         console.log(`  - ${name.padEnd(20)} → \`${pattern}\``);
      });
   });
   
   console.log('\n====================\n');
}

/**
 * Validates that module paths don't conflict
 */
function validateNoDuplicates() {
   const allPaths: string[] = [];
   
   Object.entries(ROUTE_PATTERNS).forEach(([moduleName, patterns]) => {
      if (typeof patterns === 'string') {
         allPaths.push(patterns);
         return;
      } 
      
      Object.values(patterns).forEach(pattern => {
         if (typeof pattern === 'string') {
            allPaths.push(pattern);
         }
      });
   });
   
   const seen = new Set<string>();
   const duplicates = new Set<string>();
   
   allPaths.forEach(path => {
      if (seen.has(path)) {
         duplicates.add(path);
      }

      seen.add(path);
   });
   
   if (duplicates.size > 0) {
      throw new Error(`❌ Duplicate route patterns detected:\n  ${Array.from(duplicates).join('\n  ')}`);
   }
   
   console.log(`✅ Path validation passed: ${allPaths.length} unique routes`);
}

/**
 * Main validation function - runs in development only
 */
export function tryValidatePaths() {
   if (import.meta.env.MODE === "production") {
      return;
   }

   try {
      generateDocs();
      validateNoDuplicates();
   } catch (error) {
      console.error('Path validation failed:', error);

      if (import.meta.env.MODE === "development") {
         console.warn('⚠️  Fix path conflicts before deploying');
      }
   }
}