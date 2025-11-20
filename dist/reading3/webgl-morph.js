// WebGL-based morphing implementation

class WebGLMorph {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    
    if (!this.gl) {
      console.error('WebGL not supported');
      return;
    }
    
    console.log('WebGL initialized successfully');
    
    // Enable blending for transparency
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    
    // Liquify parameters
    this.liquifyParams = {
      octaves: 3,
      displacementMult: 2.5,
      flowBias: 0.1,
      noiseScale: 0.3,
      vortexStrength: 0.5,
      vortexCount: 3,
      vortexRadius1: 300,
      vortexRadius2: 300,
      vortexRadius3: 300,
      useVortex: true  // true = vortex (with rotation), false = lens (radial only)
    };
    
    this.setupShaders();
    this.setupGeometry();
    this.setupNoiseTexture();
    this.resize();
  }
  
  updateLiquifyParams(params) {
    let needsRegen = false;
    
    if (params.octaves !== undefined && params.octaves !== this.liquifyParams.octaves) {
      this.liquifyParams.octaves = params.octaves;
      needsRegen = true;
    }
    if (params.flowBias !== undefined && params.flowBias !== this.liquifyParams.flowBias) {
      this.liquifyParams.flowBias = params.flowBias;
      needsRegen = true;
    }
    if (params.displacementMult !== undefined) {
      this.liquifyParams.displacementMult = params.displacementMult;
    }
    if (params.noiseScale !== undefined) {
      this.liquifyParams.noiseScale = params.noiseScale;
    }
    if (params.vortexStrength !== undefined) {
      this.liquifyParams.vortexStrength = params.vortexStrength;
    }
    if (params.vortexCount !== undefined && params.vortexCount !== this.liquifyParams.vortexCount) {
      this.liquifyParams.vortexCount = params.vortexCount;
      needsRegen = true;
    }
    if (params.vortexRadius1 !== undefined) {
      this.liquifyParams.vortexRadius1 = params.vortexRadius1;
    }
    if (params.vortexRadius2 !== undefined) {
      this.liquifyParams.vortexRadius2 = params.vortexRadius2;
    }
    if (params.vortexRadius3 !== undefined) {
      this.liquifyParams.vortexRadius3 = params.vortexRadius3;
    }
    if (params.useVortex !== undefined) {
      this.liquifyParams.useVortex = params.useVortex;
    }
    
    // Regenerate noise texture if octaves or flow bias changed
    if (needsRegen) {
      this.setupNoiseTexture();
    }
  }
  
  setupShaders() {
    const gl = this.gl;
    
    // Vertex shader - simple passthrough
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;
    
    // Fragment shader - liquid displacement effect
    const fragmentShaderSource = `
      precision mediump float;
      
      varying vec2 v_texCoord;
      uniform sampler2D u_noise;
      uniform vec2 u_resolution;
      uniform vec2 u_rectPos;      // Rectangle position (pixels)
      uniform vec2 u_rectSize;     // Rectangle size (pixels)
      uniform float u_displacement; // Displacement scale
      uniform float u_displacementMult; // Displacement multiplier
      uniform float u_noiseScale;   // Noise sampling scale
      uniform float u_vortexStrength; // Vortex/lens distortion strength
      uniform vec2 u_vortexPos1;      // First vortex position
      uniform vec2 u_vortexPos2;      // Second vortex position
      uniform vec2 u_vortexPos3;      // Third vortex position
      uniform float u_vortexRadius1;  // First vortex radius
      uniform float u_vortexRadius2;  // Second vortex radius
      uniform float u_vortexRadius3;  // Third vortex radius
      uniform float u_useVortex;      // 1.0 = vortex mode, 0.0 = lens mode
      
      void main() {
        // Convert to pixel coordinates (flip Y to match DOM coordinates)
        vec2 pixelCoord = vec2(v_texCoord.x * u_resolution.x, (1.0 - v_texCoord.y) * u_resolution.y);
        
        // Multi-scale noise sampling for liquid turbulence
        vec2 sampleCoord = v_texCoord * u_noiseScale;
        
        // Large-scale flow
        vec4 noise1 = texture2D(u_noise, sampleCoord);
        
        // Add medium-scale detail (use distorted coordinates for more organic look)
        vec2 distortedCoord = sampleCoord + (noise1.rg - 0.5) * 0.1;
        vec4 noise2 = texture2D(u_noise, distortedCoord * 2.0);
        
        // Combine scales for liquid-like turbulence
        vec2 combinedNoise = noise1.rg * 0.7 + noise2.rg * 0.3;
        
        // Calculate base displacement with adjustable multiplier
        vec2 displace = (combinedNoise - 0.5) * u_displacementMult * u_displacement;
        
        // Add focal distortion effects (vortex or lens)
        // Focal point 1
        vec2 toFocal1 = pixelCoord - u_vortexPos1;
        float dist1 = length(toFocal1);
        if (dist1 < u_vortexRadius1 && dist1 > 0.1) {
          float influence = 1.0 - (dist1 / u_vortexRadius1);
          influence = pow(influence, 2.0); // Smooth falloff
          
          // Radial distortion
          vec2 focalDisplace = normalize(toFocal1) * influence * u_vortexStrength * u_displacement * 2.0;
          
          if (u_useVortex > 0.5) {
            // Vortex mode: add swirl rotation (pulls inward with rotation)
            float angle = influence * 3.14159 * 0.5;
            mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
            focalDisplace = rotation * focalDisplace;
          } else {
            // Lens mode: push away (magnifying/bulge effect)
            focalDisplace = -focalDisplace;
          }
          
          displace += focalDisplace;
        }
        
        // Focal point 2
        vec2 toFocal2 = pixelCoord - u_vortexPos2;
        float dist2 = length(toFocal2);
        if (dist2 < u_vortexRadius2 && dist2 > 0.1) {
          float influence = 1.0 - (dist2 / u_vortexRadius2);
          influence = pow(influence, 2.0);
          
          vec2 focalDisplace = normalize(toFocal2) * influence * u_vortexStrength * u_displacement * 2.0;
          
          if (u_useVortex > 0.5) {
            // Vortex mode: add swirl rotation (opposite direction)
            float angle = -influence * 3.14159 * 0.5;
            mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
            focalDisplace = rotation * focalDisplace;
          } else {
            // Lens mode: push away (magnifying/bulge effect)
            focalDisplace = -focalDisplace;
          }
          
          displace += focalDisplace;
        }
        
        // Focal point 3
        vec2 toFocal3 = pixelCoord - u_vortexPos3;
        float dist3 = length(toFocal3);
        if (dist3 < u_vortexRadius3 && dist3 > 0.1) {
          float influence = 1.0 - (dist3 / u_vortexRadius3);
          influence = pow(influence, 2.0);
          
          vec2 focalDisplace = normalize(toFocal3) * influence * u_vortexStrength * u_displacement * 2.0;
          
          if (u_useVortex > 0.5) {
            // Vortex mode: add swirl rotation (same direction as focal 1)
            float angle = influence * 3.14159 * 0.5;
            mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
            focalDisplace = rotation * focalDisplace;
          } else {
            // Lens mode: push away (magnifying/bulge effect)
            focalDisplace = -focalDisplace;
          }
          
          displace += focalDisplace;
        }
        
        // Apply displacement to pixel coordinate
        vec2 displaced = pixelCoord + displace;
        
        // Check if displaced position is inside the rectangle
        vec2 relPos = (displaced - u_rectPos) / u_rectSize;
        
        if (relPos.x >= 0.0 && relPos.x <= 1.0 && relPos.y >= 0.0 && relPos.y <= 1.0) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Black
        } else {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); // Transparent
        }
      }
    `;
    
    // Compile shaders
    const vertexShader = this.compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    
    // Create program
    this.program = gl.createProgram();
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);
    
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error('Program link failed:', gl.getProgramInfoLog(this.program));
      return;
    }
    
    // Get attribute/uniform locations
    this.locations = {
      position: gl.getAttribLocation(this.program, 'a_position'),
      texCoord: gl.getAttribLocation(this.program, 'a_texCoord'),
      resolution: gl.getUniformLocation(this.program, 'u_resolution'),
      rectPos: gl.getUniformLocation(this.program, 'u_rectPos'),
      rectSize: gl.getUniformLocation(this.program, 'u_rectSize'),
      displacement: gl.getUniformLocation(this.program, 'u_displacement'),
      displacementMult: gl.getUniformLocation(this.program, 'u_displacementMult'),
      noiseScale: gl.getUniformLocation(this.program, 'u_noiseScale'),
      vortexStrength: gl.getUniformLocation(this.program, 'u_vortexStrength'),
      vortexPos1: gl.getUniformLocation(this.program, 'u_vortexPos1'),
      vortexPos2: gl.getUniformLocation(this.program, 'u_vortexPos2'),
      vortexPos3: gl.getUniformLocation(this.program, 'u_vortexPos3'),
      vortexRadius1: gl.getUniformLocation(this.program, 'u_vortexRadius1'),
      vortexRadius2: gl.getUniformLocation(this.program, 'u_vortexRadius2'),
      vortexRadius3: gl.getUniformLocation(this.program, 'u_vortexRadius3'),
      useVortex: gl.getUniformLocation(this.program, 'u_useVortex'),
      noise: gl.getUniformLocation(this.program, 'u_noise')
    };
  }
  
  compileShader(source, type) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile failed:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }
  
  setupGeometry() {
    const gl = this.gl;
    
    // Full-screen quad
    const positions = new Float32Array([
      -1, -1,  1, -1,  -1, 1,
      -1, 1,   1, -1,   1, 1
    ]);
    
    const texCoords = new Float32Array([
      0, 0,  1, 0,  0, 1,
      0, 1,  1, 0,  1, 1
    ]);
    
    // Position buffer
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    
    // TexCoord buffer
    this.texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
  }
  
  // Simple hash function for pseudo-random values
  hash(x, y) {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
  }
  
  // Smooth interpolation
  smoothstep(t) {
    return t * t * (3.0 - 2.0 * t);
  }
  
  // 2D Perlin-like noise
  noise2D(x, y) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    
    // Get corner values
    const a = this.hash(xi, yi);
    const b = this.hash(xi + 1, yi);
    const c = this.hash(xi, yi + 1);
    const d = this.hash(xi + 1, yi + 1);
    
    // Smooth interpolation
    const u = this.smoothstep(xf);
    const v = this.smoothstep(yf);
    
    // Bilinear interpolation
    return a * (1 - u) * (1 - v) +
           b * u * (1 - v) +
           c * (1 - u) * v +
           d * u * v;
  }
  
  // Fractal Brownian Motion - layered noise for organic look
  fbm(x, y, octaves) {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;
    
    for (let i = 0; i < octaves; i++) {
      value += this.noise2D(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }
    
    return value / maxValue;
  }
  
  setupNoiseTexture() {
    const gl = this.gl;
    const size = 512;
    
    // Generate organic flowing noise
    const data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        const fx = x / size;
        const fy = y / size;
        
        // Multi-octave noise for liquid-like turbulence
        // Large scale flow
        const flow1 = this.fbm(fx * 2, fy * 2, this.liquifyParams.octaves);
        const flow2 = this.fbm(fx * 2 + 5.2, fy * 2 + 1.3, this.liquifyParams.octaves);
        
        // Add directional flow (slight downward bias for "dripping")
        const flowBias = fy * this.liquifyParams.flowBias;
        
        // Combine with curl-like rotation
        const noise1 = flow1 + flowBias;
        const noise2 = flow2 - flowBias * 0.5;
        
        data[i] = (noise1 * 255);           // R channel (X displacement)
        data[i + 1] = (noise2 * 255);       // G channel (Y displacement)
        data[i + 2] = 128;                   // B channel (unused)
        data[i + 3] = 255;                   // Alpha
      }
    }
    
    this.noiseTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.noiseTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
  
  render(x, y, width, height, displacementScale) {
    const gl = this.gl;
    
    if (!gl || !this.program) {
      console.error('WebGL not initialized');
      return;
    }
    
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program);
    
    // Set up position attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.enableVertexAttribArray(this.locations.position);
    gl.vertexAttribPointer(this.locations.position, 2, gl.FLOAT, false, 0, 0);
    
    // Set up texCoord attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.enableVertexAttribArray(this.locations.texCoord);
    gl.vertexAttribPointer(this.locations.texCoord, 2, gl.FLOAT, false, 0, 0);
    
    // Set uniforms (pass in pixel coordinates)
    gl.uniform2f(this.locations.resolution, this.canvas.width, this.canvas.height);
    gl.uniform2f(this.locations.rectPos, x, y);
    gl.uniform2f(this.locations.rectSize, width, height);
    gl.uniform1f(this.locations.displacement, displacementScale);
    gl.uniform1f(this.locations.displacementMult, this.liquifyParams.displacementMult);
    gl.uniform1f(this.locations.noiseScale, this.liquifyParams.noiseScale);
    gl.uniform1f(this.locations.vortexStrength, this.liquifyParams.vortexStrength);
    
    // Position focal points: #1 near top-left, #2 near bottom, #3 upper-right
    gl.uniform2f(this.locations.vortexPos1, this.canvas.width * 0.25, this.canvas.height * 0.25);
    gl.uniform2f(this.locations.vortexPos2, this.canvas.width * 0.5, this.canvas.height * 0.75);
    gl.uniform2f(this.locations.vortexPos3, this.canvas.width * 0.70, this.canvas.height * 0.35);
    
    // Set focal point radii
    gl.uniform1f(this.locations.vortexRadius1, this.liquifyParams.vortexRadius1);
    gl.uniform1f(this.locations.vortexRadius2, this.liquifyParams.vortexRadius2);
    gl.uniform1f(this.locations.vortexRadius3, this.liquifyParams.vortexRadius3);
    
    // Set mode (vortex vs lens)
    gl.uniform1f(this.locations.useVortex, this.liquifyParams.useVortex ? 1.0 : 0.0);
    
    // Bind noise texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.noiseTexture);
    gl.uniform1i(this.locations.noise, 0);
    
    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}

// Export for use in main script
window.WebGLMorph = WebGLMorph;

