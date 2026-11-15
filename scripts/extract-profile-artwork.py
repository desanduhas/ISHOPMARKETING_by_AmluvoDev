"""Export individual portfolio artwork from the supplied, image-based company profile.

The source PDF contains one flattened image per page, so these exports cannot
recover detail that is not present in the PDF. Rendering the exact page clips
at double the embedded image resolution avoids additional JPEG compression.
"""

from pathlib import Path
import sys

import pymupdf


SOURCE = Path(sys.argv[1])
DESTINATION = Path(__file__).resolve().parent.parent / "public" / "res" / "projects"

# Coordinates are measured against the PDF's original 1753 x 1240 page image.
ARTWORK = [
    (6, "devii-identity", (128, 268, 477, 786)),
    (6, "devii-brandmark", (477, 268, 826, 786)),
    (6, "devii-brand-story", (852, 616, 1627, 973)),
    (7, "buygenuine-primary", (435, 232, 1318, 451)),
    (7, "buygenuine-variations", (100, 528, 821, 946)),
    (7, "buygenuine-stacked", (205, 550, 430, 713)),
    (7, "buygenuine-symbol", (435, 232, 705, 451)),
    (7, "buygenuine-wordmark", (178, 814, 433, 876)),
    (8, "island-tea-oreo", (198, 220, 806, 981)),
    (8, "island-tea-coffee", (847, 221, 1203, 667)),
    (8, "island-tea-takeaway", (1225, 576, 1590, 1034)),
    (9, "lbk-cinnamon-honey", (995, 235, 1641, 1043)),
    (9, "lbk-dates-honey", (642, 145, 955, 538)),
    (9, "lbk-sathpanguwa", (502, 558, 963, 1134)),
    (11, "seedevi-roast", (142, 263, 712, 978)),
    (11, "seedevi-biryani", (1044, 263, 1614, 978)),
    (11, "seedevi-family-pack", (739, 632, 1015, 978)),
    (12, "cafe89-brownie", (494, 251, 1261, 1018)),
    (12, "cafe89-coffee", (176, 251, 475, 625)),
    (12, "cafe89-avocado", (176, 644, 475, 1018)),
    (13, "devii-oil-label", (160, 277, 845, 965)),
    (13, "devii-bodywash-label", (871, 277, 1556, 965)),
    (14, "devii-conditioner-label", (160, 279, 845, 965)),
    (14, "devii-facialwash-label", (871, 279, 1556, 965)),
    (15, "reel-hotel-creston", (184, 251, 532, 987)),
    (15, "reel-heritage-cars", (936, 251, 1283, 987)),
]

DESTINATION.mkdir(parents=True, exist_ok=True)
document = pymupdf.open(SOURCE)
for page_number, name, coordinates in ARTWORK:
    page = document[page_number - 1]
    x0, y0, x1, y1 = coordinates
    clip = pymupdf.Rect(
        x0 * page.rect.width / 1753,
        y0 * page.rect.height / 1240,
        x1 * page.rect.width / 1753,
        y1 * page.rect.height / 1240,
    )
    if name == "buygenuine-stacked":
        # The PDF annotation at the corner is outside the logo. Cover it only
        # on this temporary export page; the source and logo remain untouched.
        with pymupdf.open() as export:
            isolated = export.new_page(width=clip.width, height=clip.height)
            isolated.show_pdf_page(isolated.rect, document, page_number - 1, clip=clip)
            isolated.draw_rect(
                pymupdf.Rect(0, 0, 26 * page.rect.width / 1753, 65 * page.rect.height / 1240),
                color=None, fill=(1, 1, 1), overlay=True,
            )
            pixmap = isolated.get_pixmap(matrix=pymupdf.Matrix(4.16, 4.16), alpha=False)
    else:
        pixmap = page.get_pixmap(matrix=pymupdf.Matrix(4.16, 4.16), clip=clip, alpha=False)
    output = DESTINATION / f"{name}.png"
    pixmap.save(output)
    print(f"{output.name}: {pixmap.width}x{pixmap.height}")
