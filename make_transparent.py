import sys
from PIL import Image

def make_transparent(image_path, tolerance=40):
    img = Image.open(image_path).convert("RGBA")
    data = img.getdata()
    
    bg_color = data[0]
    bg_r, bg_g, bg_b = bg_color[:3]
    
    new_data = []
    for item in data:
        r, g, b, a = item
        if abs(r - bg_r) <= tolerance and abs(g - bg_g) <= tolerance and abs(b - bg_b) <= tolerance:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(image_path, "PNG")
    print(f"Processed {image_path} with tolerance {tolerance}")

if __name__ == "__main__":
    make_transparent("assets/images/sleep_illustration.png")
