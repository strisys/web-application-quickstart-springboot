# Tailwind Catalyst

## Stage 1 - Tailwind Project

### Step #1 - Install tailwindcss ([docs](https://tailwindcss.com/docs/installation/using-vite))

```bash
npm install tailwindcss @tailwindcss/vite --save-dev
```

- `tailwindcss`: The core engine that scans your HTML/JS files for class names (like `bg-red-500`) and generates the corresponding CSS.

- `@tailwindcss/vite`:  A specific adapter that connects the Tailwind engine directly into Vite's build process.  Instead of running a separate process to watch your files (like in older versions), the **Vite plugin** hooks into the Vite dev server. When you save a file, Vite notifies the plugin (`@tailwindcss/vite`), which instantly calculates the new CSS needed and injects it into the browser (HMR).  Below is the [vite.config.ts](https://vite.dev/config/).

  ```typescript
  // vite.config.ts
  
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  import tailwindcss from '@tailwindcss/vite'          // <--- You import the plugin here
  
  // https://vitejs.dev/config/
  export default defineConfig({
    plugins: [
      react(),
      tailwindcss(),                                   // <--- The plugin is initialized here
    ],
  })
  
  ```

  Adding `tailwindcss()` to the `plugins` array tells Vite to run this code specifically. Now, every time Vite serves your app or builds it for production, it will pass your code through the Tailwind engine.

---

**vite.config.ts** ([docs](https://vite.dev/config/))

The `vite.config.ts` file is the **instruction manual** or **specification** that you hand to Vite every time it starts up.  Without this file, Vite just follows its "factory defaults." When you create this file, you are overriding those defaults with your specific requirements.  Here is how your mental model of "specification" maps to the actual code:

| **Your Specification (Human Intent)**                    | **The Instruction in vite.config.ts** |
| -------------------------------------------------------- | ------------------------------------- |
| **"I am building a React app."**                         | `plugins: [react()]`                  |
| **"I want to use Tailwind CSS."**                        | `plugins: [tailwindcss()]`            |
| **"I want the server to run on port 3000."**             | `server: { port: 3000 }`              |
| **"When I build for production, put files in `_site`."** | `build: { outDir: '_site' }`          |
| **"Let me use `@` to refer to my `src` folder."**        | `resolve: { alias: { '@': '/src' } }` |

Why it matters for what we just did?  When you ran `npm install`, you downloaded the Tailwind tools, but Vite didn't know they existed yet.  By editing `vite.config.ts`, you explicitly updated the specification to say: *"Hey Vite, from now on, whenever you process a file, pass it through the Tailwind plugin first."*

**Would you like to move on to the final step: adding the CSS directive?**