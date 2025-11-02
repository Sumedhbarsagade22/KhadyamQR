# Stop any running Node.js processes
Write-Host "Stopping any running Node.js processes..."
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

# Remove node_modules and package-lock.json
Write-Host "Cleaning up..."
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue node_modules
Remove-Item -Force -ErrorAction SilentlyContinue package-lock.json
Remove-Item -Force -ErrorAction SilentlyContinue pnpm-lock.yaml

# Install dependencies
Write-Host "Installing dependencies..."
pnpm install

# Install Playwright browsers
Write-Host "Setting up Playwright..."
pnpm exec playwright install --with-deps

Write-Host "Setup complete! You can now run 'pnpm dev' to start the development server."
