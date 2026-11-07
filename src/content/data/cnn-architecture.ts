// Layer-by-layer description of the Custom CNN, read from `CustomAlzheimerNet` in the thesis notebook
// (cell 11 of "Custom CNN Model Architecture.ipynb"). Parameter counts are computed from the layer shapes
// and add up to the 2,575,764 trainable parameters the notebook prints.

export type LayerKind = "input" | "conv" | "norm" | "act" | "pool" | "dropout" | "linear" | "output" | "align";

export interface CnnLayer {
  index?: number;
  name: string;
  kind: LayerKind;
  detail: string;
  output: string;
  params: number;
}

export interface CnnBlock {
  id: string;
  label: string;
  role: string;
  /** Spatial size and channels after the block, for the 3D diagram */
  size: number;
  channels: number;
  color: string;
  layers: CnnLayer[];
}

const conv = (cin: number, cout: number) => 9 * cin * cout + cout;
const gn = (channels: number) => 2 * channels;

export const cnnBlocks: CnnBlock[] = [
  {
    id: "input",
    label: "Input",
    role: "One MRI slice, resized and loaded as RGB",
    size: 64,
    channels: 3,
    color: "var(--series-5)",
    layers: [{ name: "Input image", kind: "input", detail: "64 × 64 pixels, 3 channels, ImageNet mean and standard deviation", output: "3 × 64 × 64", params: 0 }],
  },
  ...(
    [
      [1, 3, 32, 8, 64],
      [2, 32, 64, 16, 32],
      [3, 64, 128, 32, 16],
      [4, 128, 256, 32, 8],
    ] as [number, number, number, number, number][]
  ).map(([block, cin, cout, groups, size]) => ({
    id: `block-${block}`,
    label: `Block ${block}`,
    role: block === 1 ? "Edges and outlines" : block === 2 ? "Simple textures" : block === 3 ? "Shapes such as ventricles" : "Larger tissue patterns",
    size: size / 2,
    channels: cout,
    color: ["var(--series-1)", "var(--series-3)", "var(--series-4)", "var(--series-2)"][block - 1] as string,
    layers: [
      { index: (block - 1) * 4, name: `Conv2d ${cin} → ${cout}`, kind: "conv" as const, detail: "3 × 3 kernel, stride 1, padding 1", output: `${cout} × ${size} × ${size}`, params: conv(cin, cout) },
      { index: (block - 1) * 4 + 1, name: `GroupNorm (${groups} groups)`, kind: "norm" as const, detail: `Normalises over groups of ${cout / groups} channels, independent of batch size`, output: `${cout} × ${size} × ${size}`, params: gn(cout) },
      { index: (block - 1) * 4 + 2, name: "GELU", kind: "act" as const, detail: "Smooth non-linear activation", output: `${cout} × ${size} × ${size}`, params: 0 },
      { index: (block - 1) * 4 + 3, name: "MaxPool2d", kind: "pool" as const, detail: "2 × 2 window, halves height and width", output: `${cout} × ${size / 2} × ${size / 2}`, params: 0 },
    ],
  })),
  {
    id: "block-5",
    label: "Block 5",
    role: "Abstract features, pooled to one vector",
    size: 1,
    channels: 512,
    color: "var(--series-6)",
    layers: [
      { index: 16, name: "Conv2d 256 → 512", kind: "conv", detail: "3 × 3 kernel, stride 1, padding 1", output: "512 × 4 × 4", params: conv(256, 512) },
      { index: 17, name: "GroupNorm (32 groups)", kind: "norm", detail: "Normalises over groups of 16 channels", output: "512 × 4 × 4", params: gn(512) },
      { index: 18, name: "GELU", kind: "act", detail: "Smooth non-linear activation", output: "512 × 4 × 4", params: 0 },
      { index: 19, name: "AdaptiveAvgPool2d + Flatten", kind: "pool", detail: "Averages each channel to one value", output: "512", params: 0 },
    ],
  },
  {
    id: "head",
    label: "Classifier",
    role: "Turns 512 features into four class scores",
    size: 1,
    channels: 1944,
    color: "var(--series-7)",
    layers: [
      { name: "Dropout 0.4", kind: "dropout", detail: "Drops 40% of features during training", output: "512", params: 0 },
      { name: "Linear 512 → 1944", kind: "linear", detail: "Fully connected hidden layer", output: "1944", params: 512 * 1944 + 1944 },
      { name: "GELU", kind: "act", detail: "Smooth non-linear activation", output: "1944", params: 0 },
      { name: "Dropout 0.4", kind: "dropout", detail: "Drops 40% of hidden units during training", output: "1944", params: 0 },
      { name: "Linear 1944 → 4", kind: "linear", detail: "One logit per class", output: "4", params: 1944 * 4 + 4 },
    ],
  },
  {
    id: "align",
    label: "Alignment",
    role: "Brings the parameter count in line with the other backbones",
    size: 1,
    channels: 4,
    color: "var(--muted)",
    layers: [
      {
        name: "Alignment vector",
        kind: "align",
        detail: "152 trainable values multiplied by zero in the forward pass, so predictions are unchanged",
        output: "4 class logits",
        params: 152,
      },
    ],
  },
];

export const cnnTotalParams = cnnBlocks.reduce((sum, block) => sum + block.layers.reduce((inner, layer) => inner + layer.params, 0), 0);

export const blockParams = cnnBlocks
  .map((block) => ({ id: block.id, label: block.label, color: block.color, params: block.layers.reduce((sum, layer) => sum + layer.params, 0) }))
  .filter((block) => block.params > 0);

export const backboneComparison = [
  {
    name: "Custom CNN",
    origin: "Trained from scratch",
    normalisation: "Group Normalisation",
    activation: "GELU",
    depth: "5 convolution blocks, 2-layer head",
    frozen: "Nothing frozen",
    head: "Dropout 0.4, Linear 512 → 1944, GELU, Dropout 0.4, Linear 1944 → 4",
    total: 2575764,
    trainable: 2575764,
  },
  {
    name: "MobileNetV2",
    origin: "ImageNet-pretrained",
    normalisation: "Batch Normalisation",
    activation: "ReLU6",
    depth: "17 inverted residual blocks",
    frozen: "Stem and first 11 blocks frozen (features[:12])",
    head: "Dropout 0.2, Linear 1280 → 512, ReLU, Dropout 0.2, Linear 512 → 4",
    total: 2881796,
    trainable: 2575812,
  },
  {
    name: "EfficientNetB0",
    origin: "ImageNet-pretrained",
    normalisation: "Batch Normalisation",
    activation: "SiLU",
    depth: "16 MBConv blocks with squeeze-and-excitation",
    frozen: "Earliest layers frozen until 2,575,764 remain trainable",
    head: "Dropout 0.2, Linear 1280 → 4",
    total: 4055296,
    trainable: 2575764,
  },
];
