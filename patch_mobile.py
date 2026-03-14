import os
import glob

# The CSS to inject
CSS_PATCH = """
    <!-- wwg-mobile-patch-start -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <style>
        canvas {
            max-width: 100vw;
            max-height: 100vh;
            touch-action: none;
        }
    </style>
    <!-- wwg-mobile-patch-end -->
"""

# The JS to inject
JS_PATCH = """
    <!-- wwg-mobile-patch-js-start -->
    <script>
        // Touch-to-Mouse Polyfill for legacy canvas interactives
        document.addEventListener('touchstart', function(e) {
            if(e.touches.length > 0) {
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent('mousedown', {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    bubbles: true,
                    cancelable: true
                });
                e.target.dispatchEvent(mouseEvent);
            }
        }, {passive: false});

        document.addEventListener('touchmove', function(e) {
            if(e.touches.length > 0) {
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    bubbles: true,
                    cancelable: true
                });
                e.target.dispatchEvent(mouseEvent);
            }
        }, {passive: false});

        document.addEventListener('touchend', function(e) {
            const mouseEvent = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true
            });
            e.target.dispatchEvent(mouseEvent);
        }, {passive: false});
    </script>
    <!-- wwg-mobile-patch-js-end -->
"""

excludes = ['index.html', 'terminal.html']

def patch_file(filepath):
    filename = os.path.basename(filepath)
    if filename in excludes:
        return False
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if 'wwg-mobile-patch-start' in content:
        print(f"Skipping {filename} (already patched)")
        return False

    # Inject CSS/Meta before </head>
    if '</head>' in content:
        content = content.replace('</head>', f"{CSS_PATCH}\n</head>")
    else:
        # Just prepend if no head
        content = f"{CSS_PATCH}\n{content}"

    # Inject JS before </body>
    if '</body>' in content:
        content = content.replace('</body>', f"{JS_PATCH}\n</body>")
    else:
        # Append if no body
        content = f"{content}\n{JS_PATCH}"

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Patched {filename}")
    return True

html_files = glob.glob('*.html')
patched_count = 0
for file in html_files:
    if patch_file(file):
        patched_count += 1

print(f"Successfully patched {patched_count} files.")
