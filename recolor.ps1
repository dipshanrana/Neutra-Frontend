$replacements = @(
    @('shadow-\[0_4px_20px_rgba\(217,130,0,0\.28\)\]', 'shadow-[0_4px_20px_rgba(5,150,105,0.28)]'),
    @('shadow-\[0_0_0_3px_rgba\(245,158,11,0\.15\)\]', 'shadow-[0_0_0_3px_rgba(16,185,129,0.18)]'),
    @('shadow-\[0_0_0_2px_rgba\(251,191,36,0\.25\)\]', 'shadow-[0_0_0_2px_rgba(16,185,129,0.22)]'),
    @('ring-amber-300', 'ring-emerald-300'),
    @('ring-amber-400', 'ring-emerald-400'),
    @('fill-amber-500', 'fill-emerald-500'),
    @('fill-amber-400', 'fill-emerald-500'),
    @('hover:bg-amber-600', 'hover:bg-emerald-700'),
    @('hover:bg-amber-700', 'hover:bg-emerald-800'),
    @('hover:text-amber-700', 'hover:text-emerald-700'),
    @('bg-amber-500', 'bg-emerald-600'),
    @('bg-amber-600', 'bg-emerald-700'),
    @('bg-amber-400', 'bg-emerald-500'),
    @('bg-amber-50', 'bg-emerald-50'),
    @('bg-amber-100', 'bg-emerald-100'),
    @('border-amber-500', 'border-emerald-600'),
    @('border-amber-400', 'border-emerald-500'),
    @('border-amber-200', 'border-emerald-200'),
    @('border-amber-300', 'border-emerald-300'),
    @('text-amber-700', 'text-emerald-800'),
    @('text-amber-600', 'text-emerald-700'),
    @('text-amber-500', 'text-emerald-600')
)

# Get all tsx files recursively
$allFiles = Get-ChildItem -Path "." -Recurse -Include "*.tsx","*.css" | Where-Object { $_.FullName -notmatch "node_modules|\.next" }

foreach ($item in $allFiles) {
    $path = $item.FullName
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    $original = $content
    foreach ($pair in $replacements) {
        $content = $content -replace $pair[0], $pair[1]
    }
    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated: $path"
    }
}
Write-Host "All done!"
