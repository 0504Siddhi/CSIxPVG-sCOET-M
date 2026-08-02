import fitz # PyMuPDF
import os

pdf_path = r"C:\Users\Nehal\.gemini\antigravity-ide\brain\01279864-d02e-4f2f-bfbf-ea9ed2b8b8db\media__1785642045590.pdf"
output_dir = r"d:\Nehal\CSI CLUB\scripts\extracted"
os.makedirs(output_dir, exist_ok=True)

doc = fitz.open(pdf_path)
print(f"Total pages: {len(doc)}")

img_count = 0
for page_num in range(len(doc)):
    page = doc.load_page(page_num)
    image_list = page.get_images(full=True)
    print(f"Page {page_num + 1} has {len(image_list)} images")
    for img_idx, img in enumerate(image_list):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        img_name = f"page_{page_num + 1}_img_{img_idx + 1}.{image_ext}"
        img_path = os.path.join(output_dir, img_name)
        with open(img_path, "wb") as f:
            f.write(image_bytes)
        print(f"Saved {img_path}")
        img_count += 1

print(f"Extracted {img_count} images in total.")
