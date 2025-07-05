tailwind.config = {
  theme: {
    extend: {
      colors: {
        neon: {
          pink: "#ff00ff",
          blue: "#00ffff",
          purple: "#9d00ff",
          green: "#00ff88",
          white: "#fff", // A bright, shiny gold
          gold: "#FFD700", // A bright, shiny gold
        },
        // Made darker
        sol: "#FFB300", // A darker, more golden yellow
        dark: "#00000A",    // Very dark blue-black
        darker: "#000005",  // Near pure black
        // Sonic Theme Colors
        'sonic-blue': '#007FFF', // A bright, recognizable Sonic blue
        'sonic-red': '#ED1C24',  // For Sonic's shoes
        'sonic-yellow': '#FFD700', // Gold for rings/Chaos Emeralds
        'sonic-green-hill': '#3CB043', // A classic Green Hill Zone green
        'sonic-sky': '#87CEEB', // Light blue for sky elements
        'sonic-purple': '#e607e6', // For special items or effects
         // A bright, shiny gold for links
        },
        fontFamily: {
          sans: ['"Exo 2"', "sans-serif"],
          mono: ['"Space Mono"', "monospace"],
          alphacorsa: ['"Alphacorsa"', "sans-serif"],
        // Consider adding a pixelated or retro font here if you find one, e.g.:
        // 'pixel-font': ['"Press Start 2P"', 'cursive'], // You'd need to link this from Google Fonts
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        wave: "wave 3s ease-in-out infinite",
        "neon-flicker": "neon-flicker 1.5s infinite alternate",
        "text-shine": "text-shine 2s linear infinite",
        "border-glow": "border-glow 3s ease infinite",
        "spin-slow": "spin 5s linear infinite",
        "bounce-alt": "bounce 2s infinite alternate",
        "pulse-alt": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ping-alt": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "svg-dash": "svg-dash 5s linear infinite forwards",
        "svg-fade": "svg-fade 3s ease-in-out infinite alternate",
        // Sonic Theme Animations
        'ring-spin': 'ring-spin 1s linear infinite', // For rings
        'speed-dash': 'speed-dash 0.5s ease-out forwards', // For quick movements
        'item-bounce': 'item-bounce 1s ease-in-out infinite alternate', // For collectible items
        'chaos-emerald-glow': 'chaos-emerald-glow 2s ease-in-out infinite alternate', // For special items
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { "box-shadow": "0 0 5px #ff00ff" },
          "100%": { "box-shadow": "0 0 20px #ff00ff, 0 0 30px #00ffff" },
        },
        wave: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "neon-flicker": {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": {
            "text-shadow": `
                                -0.2rem -0.2rem 1rem #fff,
                                0.2rem 0.2rem 1rem #fff,
                                0 0 2rem var(--tw-text-opacity),
                                0 0 4rem var(--tw-text-opacity),
                                0 0 6rem var(--tw-text-opacity),
                                0 0 8rem var(--tw-text-opacity),
                                0 0 10rem var(--tw-text-opacity)'
                            `,
            "box-shadow": `
                                0 0 .5rem #fff,
                                inset 0 0 .5rem #fff,
                                0 0 2rem var(--tw-shadow-color),
                                inset 0 0 2rem var(--tw-shadow-color),
                                0 0 4rem var(--tw-shadow-color),
                                inset 0 0 4rem var(--tw-shadow-color)'
                            `,
          },
          "20%, 24%, 55%": {
            "text-shadow": "none",
            "box-shadow": "none",
          },
        },
        "text-shine": {
          "0%": { "background-position": "0% 50%" },
          "100%": { "background-position": "100% 50%" },
        },
        "border-glow": {
          "0%, 100%": { "border-color": "rgba(0, 255, 255, 0.5)" },
          "50%": { "border-color": "rgba(0, 255, 255, 1)" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        bounce: {
          "0%, 100%": {
            transform: "translateY(-25%)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "none",
            "animation-timing-function": "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "svg-dash": {
          "0%": { "stroke-dashoffset": "1000" },
          "100%": { "stroke-dashoffset": "0" },
        },
        "svg-fade": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        // Sonic Theme Keyframes
        'ring-spin': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        'speed-dash': {
          '0%': { transform: 'translateX(0) scaleX(1)' },
          '50%': { transform: 'translateX(100px) scaleX(1.2)' }, // Simulate stretching with speed
          '100%': { transform: 'translateX(200px) scaleX(0)' }, // Vanish quickly
        },
        'item-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'chaos-emerald-glow': {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))',
            transform: 'scale(1)',
          },
          '50%': {
            filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 1))',
            transform: 'scale(1.05)',
          },
        },
      },
    },
  },
};