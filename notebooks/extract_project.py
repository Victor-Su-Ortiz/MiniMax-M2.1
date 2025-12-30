#!/usr/bin/env python3
"""
Extract generated Next.js code from markdown files into runnable project files.

Usage:
    python extract_project.py <markdown_file> [output_dir]
    
Example:
    python extract_project.py generated_nextjs/minimax_MiniMax_M2_1.md projects/taskflow_minimax
"""

import os
import re
import sys
from pathlib import Path


def extract_to_project(content: str, output_dir: str) -> dict:
    """Extract generated code into actual project files."""
    
    # Clean content - remove thinking blocks
    content = re.sub(r'<think>.*?</think>', '', content, flags=re.DOTALL)
    
    # Multiple patterns to match file markers from different models
    patterns = [
        # Pattern 1: // === FILE: path/to/file.tsx === followed by code block
        r'// ===\s*FILE:\s*([^\s=]+)\s*===\s*\n```(?:typescript|tsx|javascript|jsx|json|css|bash)?\s*\n(.*?)```',
        # Pattern 2: // === FILE: path/to/file.tsx === followed by direct code
        r'// ===\s*FILE:\s*([^\s=]+)\s*===\s*\n(.*?)(?=// ===\s*(?:FILE:|END)|$)',
        # Pattern 3: ### path/to/file.tsx followed by code block
        r'(?:###|\*\*)\s*([^\s*#]+\.(?:tsx?|jsx?|css|json|mjs))\s*(?:\*\*)?\s*\n```(?:typescript|tsx|javascript|jsx|json|css)?\s*\n(.*?)```',
        # Pattern 4: `path/to/file.tsx` followed by code block
        r'`([^`]+\.(?:tsx?|jsx?|css|json|mjs))`[^\n]*\n```(?:typescript|tsx|javascript|jsx|json|css)?\s*\n(.*?)```',
    ]
    
    files_created = []
    
    for pattern in patterns:
        matches = re.findall(pattern, content, re.DOTALL | re.IGNORECASE)
        for filepath, file_content in matches:
            filepath = filepath.strip().strip('`').strip('*').strip('#')
            if not filepath or filepath in [f[0] for f in files_created]:
                continue
            
            full_path = os.path.join(output_dir, filepath)
            dir_path = os.path.dirname(full_path)
            
            if dir_path:
                os.makedirs(dir_path, exist_ok=True)
            
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(file_content.strip())
            
            files_created.append((filepath, len(file_content)))
            print(f"  📄 {filepath}")
    
    # Create essential config files if not present
    config_files = {
        'package.json': '''{
  "name": "taskflow",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.378.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0",
    "date-fns": "^3.6.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "typescript": "^5"
  }
}''',
        'tsconfig.json': '''{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}''',
        'next.config.mjs': '''/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;''',
        'postcss.config.mjs': '''/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
export default config;''',
    }
    
    for filename, file_content in config_files.items():
        filepath = os.path.join(output_dir, filename)
        if not os.path.exists(filepath):
            dir_path = os.path.dirname(filepath)
            if dir_path:
                os.makedirs(dir_path, exist_ok=True)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(file_content)
            files_created.append((filename, len(file_content)))
            print(f"  📄 {filename} (config)")
    
    return {'files': files_created, 'total': len(files_created)}


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    
    input_file = sys.argv[1]
    
    if not os.path.exists(input_file):
        print(f"❌ File not found: {input_file}")
        sys.exit(1)
    
    # Default output directory
    if len(sys.argv) >= 3:
        output_dir = sys.argv[2]
    else:
        base_name = Path(input_file).stem
        output_dir = f"projects/{base_name}"
    
    print(f"🏗️  Extracting Next.js Project")
    print(f"=" * 50)
    print(f"📂 Input:  {input_file}")
    print(f"📁 Output: {output_dir}/")
    print()
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    os.makedirs(output_dir, exist_ok=True)
    
    print("📄 Extracting files:\n")
    stats = extract_to_project(content, output_dir)
    
    print(f"\n{'=' * 50}")
    print(f"✅ Created {stats['total']} files in {output_dir}/")
    print()
    print("🚀 To run the project:")
    print(f"   cd {output_dir}")
    print("   npm install")
    print("   npm run dev")
    print()
    print("   Then open http://localhost:3000")


if __name__ == "__main__":
    main()

