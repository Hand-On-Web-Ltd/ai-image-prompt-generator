const modifiers = {
    lighting: {
        warm: ["golden hour sunlight", "soft warm candlelight", "amber sunset glow", "cozy fireplace light"],
        cool: ["soft blue twilight", "moonlit scene", "cold winter daylight", "overcast diffused light"],
        dramatic: ["strong chiaroscuro lighting", "single spotlight from above", "rim lighting with deep shadows", "lightning flash illumination"],
        peaceful: ["soft morning light through windows", "gentle dappled sunlight", "soft overcast sky", "pastel dawn glow"],
        dark: ["dim moody lighting", "single candle in darkness", "noir-style shadows", "faint bioluminescent glow"],
        vibrant: ["vivid neon lights", "colourful studio lighting", "rainbow prism light", "bright midday sun with saturated colours"]
    },
    composition: [
        "rule of thirds composition", "centered symmetrical composition", "close-up shot",
        "wide-angle establishing shot", "bird's eye view", "low angle looking up",
        "over-the-shoulder perspective", "Dutch angle", "extreme close-up on details",
        "panoramic wide shot"
    ],
    camera: {
        "photorealistic": ["shot on Canon EOS R5, 85mm f/1.4", "Hasselblad medium format, 50mm", "Sony A7IV, 35mm f/1.8, shallow depth of field", "Fujifilm X-T5, Kodak Portra 400 film emulation"],
        "3d-render": ["Octane render, 8K", "Unreal Engine 5, ray tracing", "Cinema 4D, global illumination", "Blender Cycles, volumetric lighting"]
    },
    artistic: {
        "oil-painting": ["thick impasto brushstrokes", "glazing technique, rich colour depth", "palette knife texture, visible paint layers", "old masters technique, Rembrandt influence"],
        "watercolour": ["wet-on-wet technique, soft bleeding edges", "loose watercolour washes, visible paper texture", "delicate brushwork, transparent layers", "splatter and drip effects, spontaneous feel"],
        "pixel-art": ["16-bit retro style", "32x32 pixel grid, limited palette", "dithering for shading, NES colour palette", "isometric pixel art, clean lines"],
        "anime": ["Studio Ghibli style, hand-drawn feel", "modern anime, clean cel shading", "manga-inspired, detailed linework", "90s anime aesthetic, warm colour grading"]
    },
    quality: [
        "highly detailed", "8K resolution", "masterpiece quality",
        "award-winning", "professional", "ultra high definition",
        "intricate details", "sharp focus"
    ]
};

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generate() {
    const desc = document.getElementById('description').value.trim();
    if (!desc) {
        document.getElementById('results').innerHTML = '<p style="color:#f87171">Please enter a description first.</p>';
        return;
    }

    const style = document.getElementById('style').value;
    const mood = document.getElementById('mood').value;
    const results = document.getElementById('results');

    const prompts = [];
    for (let i = 0; i < 4; i++) {
        prompts.push(buildPrompt(desc, style, mood));
    }

    results.innerHTML = prompts.map((p, i) => `
        <div class="prompt-card">
            <div class="prompt-label">Prompt ${i + 1}</div>
            <div class="prompt-text">${p}</div>
            <button class="btn-copy" onclick="copyPrompt(this, ${i})">📋 Copy</button>
        </div>
    `).join('');
}

function buildPrompt(desc, style, mood) {
    const parts = [desc];

    // Style-specific prefix
    const styleNames = {
        "photorealistic": "photorealistic photograph",
        "oil-painting": "oil painting",
        "watercolour": "watercolour painting",
        "pixel-art": "pixel art",
        "anime": "anime illustration",
        "3d-render": "3D render"
    };
    parts[0] = styleNames[style] + " of " + desc;

    // Lighting based on mood
    parts.push(pick(modifiers.lighting[mood]));

    // Composition
    parts.push(pick(modifiers.composition));

    // Camera or artistic modifier
    if (modifiers.camera[style]) {
        parts.push(pick(modifiers.camera[style]));
    }
    if (modifiers.artistic[style]) {
        parts.push(pick(modifiers.artistic[style]));
    }

    // Quality
    parts.push(pick(modifiers.quality));
    parts.push(pick(modifiers.quality.filter(q => !parts.includes(q))));

    return parts.join(", ");
}

function copyPrompt(btn, index) {
    const text = document.querySelectorAll('.prompt-text')[index].textContent;
    navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '✅ Copied!';
        setTimeout(() => btn.textContent = '📋 Copy', 2000);
    });
}

// Allow Enter key to generate
document.getElementById('description').addEventListener('keydown', e => {
    if (e.key === 'Enter') generate();
});
