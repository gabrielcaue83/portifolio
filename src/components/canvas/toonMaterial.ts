import { BackSide, Color, ShaderMaterial, Vector3 } from 'three'

/**
 * Uniforms globais do cel-shading. Compartilhados por referência entre todos
 * os materiais: mudar `value` aqui muda a luz do mundo inteiro.
 */
export const toonUniforms = {
  uLightDir: { value: new Vector3(0.5, 1, 0.8).normalize() },
  uLightColor: { value: new Color('#ffffff') },
  uSteps: { value: 4 },
}

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uShadow;
  uniform vec3 uLightDir;
  uniform vec3 uLightColor;
  uniform float uSteps;

  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vViewDir);
    vec3 l = normalize(uLightDir);

    // Half-Lambert quantizado em bandas: o "cel" do cel-shading
    float steps = max(floor(uSteps + 0.5), 2.0);
    float diffuse = dot(n, l) * 0.5 + 0.5;
    float band = floor(diffuse * steps) / (steps - 1.0);
    vec3 color = mix(uShadow, uColor, clamp(band, 0.0, 1.0));

    // Brilho especular duro (bolinha branca de desenho animado)
    float spec = step(0.985, dot(n, normalize(l + v)));
    color = mix(color, vec3(1.0), spec * 0.8);

    // Rim light só do lado iluminado
    float rim = step(0.75, (1.0 - max(dot(v, n), 0.0)) * diffuse);
    color = mix(color, uColor * 1.25, rim * 0.5);

    gl_FragColor = vec4(color * uLightColor, 1.0);
    #include <colorspace_fragment>
  }
`

const outlineVertex = /* glsl */ `
  uniform float uThickness;
  void main() {
    // Empurra os vértices ao longo da normal: casca preta atrás do objeto
    vec3 p = position + normal * uThickness;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const outlineFragment = /* glsl */ `
  void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); }
`

const SHADOW_TINT = new Color('#3b1a6b')

export function createToonMaterial(color: string) {
  const base = new Color(color)
  // Sombra puxada para o roxo, como em pintura de animação (nunca preto/cinza)
  const shadow = base.clone().multiplyScalar(0.55).lerp(SHADOW_TINT, 0.25)
  return new ShaderMaterial({
    uniforms: {
      ...toonUniforms,
      uColor: { value: base },
      uShadow: { value: shadow },
    },
    vertexShader,
    fragmentShader,
  })
}

export function createOutlineMaterial(thickness: number) {
  return new ShaderMaterial({
    uniforms: { uThickness: { value: thickness } },
    vertexShader: outlineVertex,
    fragmentShader: outlineFragment,
    side: BackSide,
  })
}
