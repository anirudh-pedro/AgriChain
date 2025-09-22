# AgriChain - Install Required Dependencies

Write-Host "Installing required dependencies for AgriChain Traceability and Analytics features..." -ForegroundColor Green

# Navigate to frontend directory
Set-Location ".\frontend"

Write-Host "Installing Chart.js and Recharts for analytics..." -ForegroundColor Yellow
npm install recharts chart.js react-chartjs-2

Write-Host "Installing QR Code libraries..." -ForegroundColor Yellow
npm install qrcode qr-scanner

Write-Host "Installing additional utility libraries..." -ForegroundColor Yellow
npm install html2canvas jspdf

Write-Host "Dependencies installed successfully!" -ForegroundColor Green
Write-Host "You can now use the following features:" -ForegroundColor Cyan
Write-Host "- Produce Traceability with QR Code scanning" -ForegroundColor White
Write-Host "- Transaction History with filtering and export" -ForegroundColor White
Write-Host "- Analytics Dashboard with charts and graphs" -ForegroundColor White
Write-Host "- QR Code generation for produce batches" -ForegroundColor White

Set-Location ".."
Write-Host "Setup complete! You can now start the development server." -ForegroundColor Green