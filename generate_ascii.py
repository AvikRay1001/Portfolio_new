import sys
from PIL import Image, ImageDraw, ImageFont

# ASCII characters from darkest to lightest
ASCII_CHARS = ["@", "#", "S", "%", "?", "*", "+", ";", ":", ",", ".", " "]

def resize_image(image, new_width=150):
    width, height = image.size
    ratio = height / width
    # Font height is usually about 2x the width of a character. 
    new_height = int(new_width * ratio * 0.55)
    resized_image = image.resize((new_width, new_height))
    return resized_image

def grayify(image):
    return image.convert("L")

def pixels_to_ascii(image):
    pixels = image.getdata()
    # Map 0-255 to 0-len(ASCII_CHARS)-1
    # For a dark background and white text, darker pixels should map to darker characters (like space or dot).
    # Wait, the reference has white text on black. 
    # If the original image is a photo of a person:
    # Brightest parts of face should be dense ASCII (like @ or #)
    # Darkest parts of background should be spaces or dots.
    # So we invert the mapping:
    inverted_chars = ASCII_CHARS[::-1]
    characters = "".join([inverted_chars[min(pixel//22, len(inverted_chars)-1)] for pixel in pixels])
    return characters

def generate_ascii_image(image_path, output_path, new_width=120):
    try:
        image = Image.open(image_path)
    except Exception as e:
        print(f"Unable to open image: {e}")
        return

    # Create ASCII string
    image = resize_image(image, new_width)
    image = grayify(image)
    ascii_str = pixels_to_ascii(image)

    img_width = image.width
    img_height = image.height

    ascii_lines = [ascii_str[index: index + img_width] for index in range(0, len(ascii_str), img_width)]
    
    # Try to load a monospaced font
    try:
        font = ImageFont.truetype("consola.ttf", 15)
        char_height = 15
        char_width = 8
    except IOError:
        try:
            font = ImageFont.truetype("cour.ttf", 15)
            char_height = 15
            char_width = 9
        except IOError:
            font = ImageFont.load_default()
            char_height = 11
            char_width = 6

    # Create a new image for the ASCII art
    out_width = img_width * char_width
    out_height = img_height * char_height
    
    out_img = Image.new("RGB", (out_width, out_height), color=(5, 5, 5))
    draw = ImageDraw.Draw(out_img)

    y_text = 0
    for line in ascii_lines:
        draw.text((0, y_text), line, font=font, fill=(200, 200, 200)) # Light gray text
        y_text += char_height
        
    out_img.save(output_path)
    print(f"Saved ASCII image to {output_path}")

if __name__ == '__main__':
    generate_ascii_image('Screenshot 2025-07-31 190821.png', 'ascii_bg.png', new_width=150)
