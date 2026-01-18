---
description: How to Create Your Own 3D Coffee Models
---
# How to Create 3D Models for Cyber Barista

Since you are building a premium "Cyber" brand, having custom 3D assets is key.
Here is the recommended workflow to generate your own `.glb` files using AI.

## 1. **Use Meshy.ai (Recommended)**
Meshy is currently the best AI tool for generating 3D models from text or images.

1.  **Go to:** [meshy.ai](https://www.meshy.ai/)
2.  **Sign Up** (Free tier is sufficient for testing).
3.  **Choose "Text to 3D"**:
    *   **Prompt:** "A ceramic coffee mug with the text 'CYBER' engraved on it, photorealistic, 4k texture"
    *   **Style:** Realistic
4.  **Wait for Generation:** It takes about 2 minutes.
5.  **Refine:** Pick the best version and click "Refine" to get high-quality textures.
6.  **Download:** Click "Download" and choose **GLB** format.

## 2. **Use Tripo3D**
An alternative is [tripo3d.ai](https://www.tripo3d.ai/) which is faster but sometimes less detailed.

1.  **Prompt:** "Paper coffee bag, brown, wrinkled, with logo"
2.  **Download:** GLB format.

## 3. **Testing Your Model**
We have built a **Developer Mode** directly into your product page!

1.  Go to any product page (e.g. `http://localhost:3000/shop/product-id`).
2.  **Drag and Drop** your downloaded `.glb` file directly onto the 3D viewer area.
3.  It will instantly replace the placeholder so you can see how it looks.

## 4. **Publishing**
Once you are happy with a file:
1.  Rename it to `coffee-cup.glb` (or the specific product name).
2.  Move it to the `public/models/` folder in your project.
3.  Update the code in `app/shop/[id]/page.tsx` if needed to point to varying filenames.
