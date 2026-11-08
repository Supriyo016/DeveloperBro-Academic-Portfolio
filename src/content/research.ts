import type { ResearchStudy } from "@/types/content";

export const studies: ResearchStudy[] = [
  {
    slug: "federated-alzheimers-detection",
    title:
      "Privacy-Preserving Alzheimer's Disease Detection for Non-IID MRI Data: A Comparative Analysis of Federated Learning Algorithms under Homomorphic Encryption",
    shortTitle: "Federated Alzheimer's detection from MRI",
    kind: "M.Tech dissertation",
    hero: "mri",
    status: "Completed",
    period: "2024 – 2026",
    institution: "Kalyani Government Engineering College (MAKAUT, WB)",
    supervisors: [
      "Dr. Jyotsna Kumar Mandal, Professor, Department of CSE, Kalyani University",
      "Dr. Swapan Kumar Mandal, Professor, Department of CSE, Kalyani Government Engineering College",
    ],
    abstract:
      "Hospitals rarely can pool brain scans, and the data each one holds looks different. This dissertation compares three convolutional backbones and three federated algorithms for four-class Alzheimer's classification under one fixed protocol, with images split unevenly across five simulated clients. A compact Custom CNN with Group Normalisation, trained with FedAvg, reached 94.59% accuracy on 8,800 held-out images, ahead of both ImageNet-pretrained backbones. CKKS homomorphic encryption was prototyped alongside training. Each result comes from a single run on a pre-augmented public dataset, so the limitations matter.",
    domains: ["Federated Learning", "Medical Image Analysis", "Deep Learning", "Homomorphic Encryption"],
    methods: ["FedAvg", "FedProx", "FedDyn", "Dirichlet non-IID partitioning", "Group Normalisation", "CKKS"],
    technologies: ["Python", "PyTorch", "Flower", "TenSEAL", "scikit-learn", "Kaggle Notebooks"],
    motivation: [
      "Convolutional networks can classify Alzheimer's disease from MRI, but the usual recipe pools data from many hospitals into one place. Patient privacy and data-protection law often rule that out.",
      "Federated learning keeps images at each site and shares only model updates. Published results are hard to compare, though, because they differ in dataset, resolution, client count and privacy setup. A hospital group choosing a backbone and an algorithm has no like-for-like evidence to go on.",
    ],
    problem:
      "When data is non-IID across clients, which CNN backbone and which federated algorithm should be preferred, once every other factor is held constant?",
    questions: [
      "How do the backbone and the federated algorithm jointly affect classification quality?",
      "Which of the nine configurations gives the best result?",
    ],
    gaps: [
      {
        title: "Imaging gap",
        body: "CNN studies of Alzheimer's classification mostly use centralised, identically distributed data, so their accuracy may not transfer to a distributed setting.",
      },
      {
        title: "Federation gap",
        body: "Federated medical imaging studies often fix one backbone and test one or two aggregation algorithms.",
      },
      {
        title: "Comparability gap",
        body: "Published results differ in dataset, resolution, client count and privacy setup, so reported advantages may reflect the setup rather than the method.",
      },
    ],
    objectives: [
      "Configure MobileNetV2, EfficientNetB0 and a proposed Custom CNN with matched trainable parameter counts.",
      "Implement FedAvg, FedProx and FedDyn in one simulation so only the training rule changes between runs.",
      "Prototype CKKS encryption of model parameters with TenSEAL.",
      "Evaluate all nine combinations on a strongly non-IID partition against one held-out test set.",
    ],
    methodology: [
      {
        title: "One protocol, nine runs",
        body: "A full factorial design crosses three backbones with three algorithms. Dataset, partition, test set, seed and training budget stay the same, so differences point to the two factors under study, within the limits of one run each.",
      },
      {
        title: "Matched capacity",
        body: "All three networks train about 2.58 million parameters. EfficientNetB0 and MobileNetV2 reach this by freezing part of the network; the Custom CNN uses a small alignment vector to land within 48 parameters of them.",
      },
      {
        title: "Skewed clients",
        body: "A Dirichlet partition with α = 0.5 splits the 35,200 training images across five clients. The largest holds 11,201 images and the smallest 3,521, and each has a different class mix.",
      },
      {
        title: "Custom CNN",
        body: "Five convolutional stages with widths from 32 to 512, Group Normalisation in place of Batch Normalisation, GELU activations and a two-layer head with dropout. Trained from scratch, without ImageNet weights.",
      },
    ],
    dataset: {
      summary:
        "A public four-class Alzheimer's MRI dataset of 44,000 images. The published set is already augmented, images were loaded as RGB and resized to 64 × 64, and a stratified 80:20 split was made per image.",
      source: { label: "Dataset on Kaggle", href: "https://www.kaggle.com/datasets/aryansinghal10/alzheimers-multiclass-dataset-equal-and-augmented" },
      classes: [
        { name: "Mild Demented", total: 10000, train: 8000, test: 2000 },
        { name: "Moderate Demented", total: 10000, train: 8000, test: 2000 },
        { name: "Non-Demented", total: 12800, train: 10240, test: 2560 },
        { name: "Very Mild Demented", total: 11200, train: 8960, test: 2240 },
      ],
    },
    models: [
      { name: "Custom CNN", role: "Proposed, trained from scratch", detail: "2,575,764 trainable parameters. Five convolutional stages with Group Normalisation." },
      { name: "MobileNetV2", role: "ImageNet-pretrained", detail: "2,575,812 trainable of 2,881,796 parameters." },
      { name: "EfficientNetB0", role: "ImageNet-pretrained", detail: "2,575,764 trainable of 4,055,296 parameters." },
    ],
    algorithms: [
      { name: "FedAvg", detail: "Sample-weighted averaging of client models." },
      { name: "FedProx", detail: "Adds a proximal term to local training, with μ = 0.01." },
      { name: "FedDyn", detail: "Adds a dynamic regulariser to local training, with coefficient 0.01." },
    ],
    metrics: [
      "Test accuracy and test loss on 8,800 held-out images",
      "Macro precision, recall and F1-score, so that each class counts equally",
      "One-versus-rest macro AUC, where it was logged",
      "Per-class precision, recall and F1-score",
      "Test accuracy for every communication round",
    ],
    setup: [
      { label: "Input", value: "64 × 64 × 3" },
      { label: "Clients", value: "5, Dirichlet α = 0.5" },
      { label: "Training", value: "30 rounds, 10 local epochs" },
      { label: "Local validation", value: "Stratified 10-fold cross-validation on each client's data, before federated training" },
      { label: "Optimiser", value: "Adam, learning rate 1e-4, batch size 128" },
      { label: "Loss", value: "Cross-entropy, label smoothing 0.05, class weights" },
      { label: "Hardware", value: "Single NVIDIA Tesla T4 (16 GB), Kaggle Notebooks" },
      { label: "CKKS prototype", value: "Degree 8192, modulus chain [60, 40, 40, 60], scale 2^40" },
    ],
    stats: [
      { value: "94.59%", label: "Test accuracy" },
      { value: "94.80%", label: "Macro F1" },
      { value: "99.50%", label: "Macro AUC" },
      { value: "9", label: "Configurations compared" },
    ],
    findings: [
      "The backbone mattered far more than the algorithm. Mean macro F1 was 94.24% for the Custom CNN, 92.69% for MobileNetV2 and 78.39% for EfficientNetB0.",
      "FedAvg gave the best macro F1 on all three backbones, despite FedProx and FedDyn being designed for heterogeneous data. On MobileNetV2 the three sat within 0.17 points of each other.",
      "A compact network trained from scratch beat two pretrained backbones. EfficientNetB0, usually strong on centralised benchmarks, was the weakest here.",
      "Very Mild Demented was the hardest class in all nine runs, with the lowest per-class F1 every time. Early-stage disease is also where detection matters most.",
    ],
    conclusions: [
      "The backbone decided the outcome far more than the federated algorithm. Across the three algorithms, mean macro F1 was 94.24% for the Custom CNN, 92.69% for MobileNetV2 and 78.39% for EfficientNetB0, a spread of almost 16 points. The three algorithms on one backbone never differed by more than 1.6 points of F1.",
      "The best configuration was the Custom CNN with FedAvg: 94.59% accuracy, 94.80% macro F1, 99.50% macro AUC and the lowest test loss, 0.1725. It also reached 90% accuracy first among the Custom CNN runs.",
      "FedAvg was enough. FedProx and FedDyn, built for heterogeneous clients, did not beat plain averaging on any backbone in these runs.",
      "A compact network trained from scratch beat two ImageNet-pretrained backbones of the same trainable size. My explanation is Group Normalisation, which does not depend on batch statistics that differ between skewed clients. That remains a hypothesis until a Batch Normalisation ablation of the Custom CNN is run.",
      "Very Mild Demented, the earliest stage, was the hardest class in all nine runs, and Moderate Demented the easiest. Better early-stage detection is where the next gains matter clinically.",
      "These are single runs on a pre-augmented dataset split per image, so the absolute scores are probably optimistic. The ranking of backbones is the more robust result. The privacy cost of full encrypted aggregation still has to be measured, and that is the subject of my ongoing work.",
    ],
    contributions: [
      "A controlled comparison of nine backbone and algorithm combinations under one data split, partition and training budget.",
      "Trainable parameter counts matched across backbones, so capacity is not the obvious explanation for differences.",
      "A compact Custom CNN with Group Normalisation for strongly non-IID clients, tested against two pretrained backbones.",
      "A pipeline that runs on one hosted GPU from a fixed seed, using PyTorch, Flower and TenSEAL.",
    ],
    limitations: [
      "Each configuration was trained once, so small gaps between algorithms should not be over-read.",
      "The dataset is pre-augmented and the split was made per image. Related images may sit on both sides of it, which could inflate every score here. Patient-level evaluation is the necessary next check, and my follow-up work uses group-safe splits.",
      "Group Normalisation is the likely reason for the Custom CNN's lead, but this is a hypothesis. The backbones also differ in pretraining and in which layers are frozen, and no ablation isolates normalisation.",
      "The study uses one dataset of 64 × 64 2D slices, one Dirichlet setting, and five clients simulated on a single GPU.",
    ],
    future: [
      "Run the full comparison under end-to-end encrypted aggregation and measure the real cost.",
      "Repeat with patient-level splits and multiple seeds.",
      "Isolate normalisation with a Batch Normalisation ablation of the Custom CNN.",
      "Use federated knowledge distillation to reduce what clients must send.",
      "Explore personalised models and multi-modal inputs such as PET and clinical scores.",
    ],
    references: [
      { text: "McMahan et al. Communication-Efficient Learning of Deep Networks from Decentralized Data. AISTATS, 2017.", url: "https://arxiv.org/abs/1602.05629" },
      { text: "Li et al. Federated Optimization in Heterogeneous Networks. MLSys, 2020.", url: "https://arxiv.org/abs/1812.06127" },
      { text: "Acar et al. Federated Learning Based on Dynamic Regularization. ICLR, 2021.", url: "https://arxiv.org/abs/2111.04263" },
      { text: "Hsu, Qi and Brown. Measuring the Effects of Non-Identical Data Distribution for Federated Visual Classification. 2019.", url: "https://arxiv.org/abs/1909.06335" },
      { text: "Cheon et al. Homomorphic Encryption for Arithmetic of Approximate Numbers. ASIACRYPT, 2017.", url: "https://doi.org/10.1007/978-3-319-70694-8_15" },
      { text: "Sandler et al. MobileNetV2: Inverted Residuals and Linear Bottlenecks. CVPR, 2018.", url: "https://arxiv.org/abs/1801.04381" },
      { text: "Tan and Le. EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks. ICML, 2019.", url: "https://arxiv.org/abs/1905.11946" },
      { text: "Wu and He. Group Normalization. ECCV, 2018.", url: "https://arxiv.org/abs/1803.08494" },
      { text: "Zhu et al. Federated learning on non-IID data: A survey. Neurocomputing, 2021.", url: "https://doi.org/10.1016/j.neucom.2021.07.098" },
      { text: "Wen et al. Convolutional neural networks for classification of Alzheimer's disease: Overview and reproducible evaluation. Medical Image Analysis, 2020.", url: "https://doi.org/10.1016/j.media.2020.101694" },
    ],
    citation: {
      plain:
        "Sarkar, S. (2026). Privacy-Preserving Alzheimer's Disease Detection for Non-IID MRI Data: A Comparative Analysis of Federated Learning Algorithms under Homomorphic Encryption. M.Tech dissertation, Kalyani Government Engineering College.",
      bibtex: `@mastersthesis{sarkar2026federated,
  author = {Sarkar, Supriyo},
  title  = {Privacy-Preserving Alzheimer's Disease Detection for Non-IID MRI Data: A Comparative Analysis of Federated Learning Algorithms under Homomorphic Encryption},
  school = {Kalyani Government Engineering College},
  type   = {M.Tech dissertation},
  year   = {2026}
}`,
    },
    figures: [
      {
        src: "/images/research/confusion-matrix-custom-cnn.webp",
        alt: "Confusion matrix for the Custom CNN with FedAvg across the four Alzheimer's classes. Most predictions fall on the diagonal.",
        caption: "Confusion matrix, Custom CNN with FedAvg, on the 8,800-image test set.",
        width: 947,
        height: 791,
      },
      {
        src: "/images/research/tsne-custom-cnn.webp",
        alt: "t-SNE plots of learned features for FedAvg, FedProx and FedDyn with the Custom CNN, each showing four class clusters.",
        caption: "t-SNE of learned features for the three algorithms on the Custom CNN.",
        width: 1400,
        height: 500,
      },
      {
        src: "/images/research/roc-custom-cnn.webp",
        alt: "One-versus-rest ROC curves for the Custom CNN under each of the three federated algorithms.",
        caption: "One-versus-rest ROC curves for the Custom CNN under each algorithm.",
        width: 1400,
        height: 495,
      },
    ],
    note: {
      title: "What was and was not encrypted",
      body: "The results on this page come from federated training with plaintext aggregation in Flower. CKKS was prototyped alongside it: each round, a sampled slice of the weights was encrypted and decrypted with TenSEAL to check reconstruction error. Encrypting the full model during aggregation, and measuring what that costs, is part of my follow-up work.",
    },
  },
  {
    slug: "knowledge-distillation-ckks-federated-learning",
    title: "Knowledge Distillation for CKKS-Secured Federated Learning",
    shortTitle: "Distillation for encrypted federated learning",
    kind: "Ongoing research",
    hero: "distill",
    status: "In progress",
    period: "2026 – present",
    abstract:
      "Can a small model trained across hospitals learn more when it has a stronger teacher to learn from, without any raw data leaving a hospital? This ongoing work studies knowledge distillation inside a federated system whose aggregation runs on CKKS ciphertexts, with a ResNet18 teacher and a lightweight CNN student on four-class Alzheimer's MRI. No results are reported here until the experiments are complete.",
    domains: ["Knowledge Distillation", "Federated Learning", "Homomorphic Encryption", "Medical Image Analysis"],
    methods: ["Soft-label distillation", "Attention transfer", "CKKS secure aggregation", "Group-safe cross-validation"],
    technologies: ["Python", "PyTorch", "Flower", "TenSEAL"],
    motivation: [
      "My dissertation left two open problems: full encrypted aggregation had not been measured, and a pre-augmented dataset made evaluation harder to trust. This work takes on both, and asks whether a compact student model can stay competitive with far fewer parameters.",
    ],
    problem:
      "Does distillation from a teacher improve a small federated model when clients have skewed labels and the server only ever sees ciphertexts?",
    methodology: [
      {
        title: "Encrypted aggregation",
        body: "Clients upload encrypted, sample-weighted models. The server combines ciphertexts while holding only a public context, with no secret key, and the code checks that it has none.",
      },
      {
        title: "Teacher and student",
        body: "A ResNet18 teacher guides a lightweight custom CNN student during local training at each client, through softened predictions and attention maps.",
      },
      {
        title: "Safer evaluation",
        body: "Splits are grouped so identical files cannot fall on both sides of a split, which removes one route for test data to leak into training.",
      },
      {
        title: "Measured cost",
        body: "Ciphertext size and CKKS approximation error are logged every round, so the price of privacy is measured rather than estimated.",
      },
    ],
  },
  {
    slug: "quantum-gate-assessment",
    title: "Quantum Gate Performance Assessment in the Presence of Superposition State using IBMQ Server",
    shortTitle: "Quantum gate performance on IBMQ",
    kind: "B.Tech dissertation",
    hero: "quantum",
    status: "Completed",
    period: "2023 – 2024",
    institution: "Regent Education & Research Foundation (MAKAUT, WB)",
    abstract:
      "Reversible gates such as CSWAP (Fredkin), Peres and CCNOT (Toffoli) behave perfectly on a simulator but not on today's noisy quantum processors. This dissertation ran them on IBM Quantum hardware, first on every classical input and then with the control qubit prepared in the superposition √(1/3)|0⟩ + √(2/3)|1⟩, repeating each configuration up to 20 times. On ibm_perth, 86–87% of raw shots landed on the two expected outcomes; measurement-error mitigation raised that to 92.0% for CSWAP and 98.5% for Peres. The work is a small, measured characterisation of NISQ behaviour, not a new method.",
    domains: ["Quantum Computing", "Reversible Logic", "Error Mitigation"],
    methods: ["Truth-table verification on hardware", "Superposition-state preparation", "Measurement-error mitigation", "Repeated runs (20 per configuration)"],
    technologies: ["Python", "Qiskit", "Qiskit Aer", "IBM Quantum (IBMQ provider)", "Qiskit Ignis", "Jupyter", "Google Colab", "Matplotlib", "NumPy", "Microsoft Excel"],
    note: {
      title: "A team dissertation",
      body: "The dissertation was submitted by a team of five students. Every number on this page is recomputed from the notebooks and results workbook in Supriyo's own project folder; a team member's separate set of runs is not included.",
    },
    motivation: [
      "Quantum programs are built from gates, and on noisy intermediate-scale quantum (NISQ) processors every gate and every measurement adds error, with no error correction to remove it. Cloud access through IBM Quantum makes it possible to measure that error on real devices rather than assume it.",
      "Three-qubit reversible gates are a good test case. CSWAP and the Peres gate (a Toffoli followed by a CNOT) compute classical logic reversibly, so their ideal output is known exactly, yet on hardware they must be compiled into several native two-qubit gates. Putting the control qubit into superposition checks whether the gate preserves the input's probabilities as well as its logic.",
    ],
    problem:
      "How far do reversible quantum gates drift from their ideal behaviour on IBM's NISQ hardware when the control qubit is in superposition, and how much of that drift does measurement-error mitigation remove?",
    questions: [
      "Do CNOT, CSWAP and Peres reproduce their truth tables on IBM hardware, and does accuracy depend on the input?",
      "With q0 prepared as √(1/3)|0⟩ + √(2/3)|1⟩, how close are the measured frequencies to the ideal 1/3 and 2/3?",
      "How much of the gap does measurement-error mitigation recover?",
      "Are the results stable across 20 repeated runs, two shot counts and more than one backend?",
    ],
    objectives: [
      "Build the CNOT, CCNOT, CSWAP and Peres circuits in Qiskit and check them on the Aer simulator.",
      "Run every basis input on IBM hardware, 20 times with 1,024 shots, and record the counts.",
      "Inject the superposition state on q0 and compare simulator, raw hardware and mitigated hardware results.",
      "Quantify the error relative to the simulator and the effect of a measurement filter.",
    ],
    methodology: [
      {
        title: "Truth tables on hardware",
        body: "For each input, X gates set the qubits that should be 1, a barrier separates preparation from the gate, and every qubit is measured. Each input was sent to the simulator and to an IBM backend; for CSWAP and Peres the hardware run was repeated 20 times at 1,024 shots.",
      },
      {
        title: "Superposition input",
        body: "q0 was set with qc.initialize([√(1/3), √(2/3)], 0) and q1, q2 left at 0. Ideally this gives 000 with probability 1/3 and the gate's output for 100 with probability 2/3: 100 for CSWAP and CCNOT, 110 for Peres.",
      },
      {
        title: "Measurement-error mitigation",
        body: "For each mitigated run, the eight calibration circuits from complete_meas_cal were executed on the same backend at optimisation level 0, a CompleteMeasFitter was built from them, and its filter was applied to that run's counts.",
      },
      {
        title: "Analysis",
        body: "Counts were reversed to q0 q1 q2 order, recorded in a workbook and averaged over the 20 runs. This page recomputes every figure from the saved runs: share of shots on the expected outcomes, total variation distance from the ideal distribution, run-to-run spread, and the report's deviation from the simulator.",
      },
    ],
    setup: [
      { label: "SDK", value: "Qiskit 0.45.1 with qiskit-aer 0.13.1 and qiskit-ibmq-provider 0.20.2 (versions printed in the CSWAP notebook's session); qiskit.ignis for measurement mitigation" },
      { label: "Environment", value: "Jupyter notebooks, on Google Colab (Python 3.10) and locally (Python 3.11 and 3.12)" },
      { label: "Simulator", value: "Aer qasm_simulator" },
      { label: "IBM backends", value: "ibm_perth and ibm_lagos for most runs, ibmq_quito for the CCNOT superposition run, through the IBM Quantum open plan" },
      { label: "Shots", value: "1,024 per job; one extra mitigated batch per gate at 2,048" },
      { label: "Repetitions", value: "20 runs per input and configuration, except the CNOT truth table, the ibm_perth CSWAP truth table and the CCNOT run (one run each)" },
      { label: "Compilation", value: "transpile(qc, backend) with default settings; optimisation level 0 for mitigated jobs and calibration circuits" },
      { label: "Recorded", value: "October to December 2023, from the workbook and notebook timestamps" },
    ],
    findings: [
      "On the simulator every basis input put all of its shots on the truth-table output, and the superposition runs averaged 33.6% and 66.4% (CSWAP) and 34.0% and 66.0% (Peres), close to the ideal 1/3 and 2/3.",
      "On hardware the share of shots on the correct output averaged 91.8% for CNOT on ibm_perth (one run per input), 83.7% for CSWAP on ibm_lagos, and 80.9% and 86.5% for Peres on ibm_perth and ibm_lagos (20 runs per input).",
      "Inputs with the control qubit at 1, where the gate acts, scored lower in every experiment: 79.6% against 87.7% for CSWAP on ibm_lagos, with input 110 lowest at 74.0%.",
      "With the superposition input, raw runs on ibm_perth placed 86.2% (CSWAP) and 87.4% (Peres) of shots on the two expected outcomes, and the CCNOT run on ibmq_quito 89.6%.",
      "Measurement-error mitigation raised those shares to 92.0% and 98.5% at 1,024 shots, 96.2% and 97.6% at 2,048 shots, and 95.8% for CCNOT. Distance from the ideal distribution fell from 0.138 to 0.080 for CSWAP and from 0.126 to 0.018 for Peres.",
      "Run-to-run spread was small next to these gaps: the standard deviation of the expected-outcome share over 20 raw runs was 0.7 to 1.5 percentage points.",
    ],
    conclusions: [
      "On the simulator all four gates follow their truth tables; on NISQ hardware they do so only approximately, with 74% to 94% of shots on the correct output depending on gate, input and backend.",
      "Errors are largest on inputs where the controlled operation acts, so the cost of the compiled gate, not only state preparation, shows up in the counts.",
      "For the Peres gate most of the hardware error in the superposition runs was readout error: after the measurement filter its 1,024-shot probabilities were within 2% (relative) of the simulator's.",
      "CSWAP improved less under the same filter, so part of its error comes from the gate operations themselves, which readout mitigation cannot remove.",
    ],
    limitations: [
      "Device calibration data (T1, T2, gate and readout error rates), the physical qubits chosen by the transpiler and the compiled circuit depth were not recorded, so the differences between backends cannot be explained from these files.",
      "Only measurement-error mitigation was applied. Gate errors were not mitigated, and outcomes were measured in the computational basis only, which cannot detect phase errors.",
      "One superposition state was tested, on the control qubit only. The CCNOT result is a single run, and the cell labelled CCNOT in the first notebook actually builds a CSWAP circuit, so it is not used here.",
      "The written report compared hardware against simulator averages taken from an unlabelled scratch sheet. This page uses the simulator runs saved in the notebooks instead, so its deviation figures differ from the report's percentages. Ten transcription slips in the results workbook were corrected from the notebook histograms.",
      "This is undergraduate coursework. It was not published or peer reviewed.",
    ],
    future: [
      "Repeat the runs on current IBM backends through Qiskit Runtime, recording calibration data, qubit layout and two-qubit gate counts for each job.",
      "Add gate-level mitigation, such as zero-noise extrapolation, and compare it with readout-only mitigation.",
      "Sweep the superposition weight, place superposition on the target qubits and use entangled inputs, with state tomography to see phase as well as populations.",
      "Report confidence intervals for every metric, for example by bootstrapping over shots and runs.",
    ],
    references: [
      { text: "M. A. Nielsen and I. L. Chuang, Quantum Computation and Quantum Information, 10th anniversary ed., Cambridge University Press, 2010.", url: "https://doi.org/10.1017/CBO9780511976667" },
      { text: "J. Preskill, “Quantum Computing in the NISQ era and beyond,” Quantum 2, 79 (2018).", url: "https://doi.org/10.22331/q-2018-08-06-79" },
      { text: "T. Toffoli, “Reversible computing,” Automata, Languages and Programming (ICALP 1980), LNCS 85, Springer, 1980.", url: "https://doi.org/10.1007/3-540-10003-2_104" },
      { text: "E. Fredkin and T. Toffoli, “Conservative logic,” International Journal of Theoretical Physics 21, 219–253 (1982).", url: "https://doi.org/10.1007/BF01857727" },
      { text: "A. Peres, “Reversible logic and quantum computers,” Physical Review A 32, 3266 (1985).", url: "https://doi.org/10.1103/PhysRevA.32.3266" },
      { text: "A. Barenco et al., “Elementary gates for quantum computation,” Physical Review A 52, 3457 (1995).", url: "https://doi.org/10.1103/PhysRevA.52.3457" },
      { text: "S. Bravyi, S. Sheldon, A. Kandala, D. C. McKay and J. M. Gambetta, “Mitigating measurement errors in multiqubit experiments,” Physical Review A 103, 042605 (2021).", url: "https://doi.org/10.1103/PhysRevA.103.042605" },
      { text: "A. Javadi-Abhari et al., “Quantum computing with Qiskit,” arXiv:2405.08810 (2024).", url: "https://arxiv.org/abs/2405.08810" },
      { text: "Qiskit source code and documentation (GitHub).", url: "https://github.com/Qiskit/qiskit" },
    ],
  },
];

export const proposedResearch: { title: string; body: string }[] = [
  {
    title: "Aggregation that acts on normalisation",
    body: "A federated algorithm that treats normalisation parameters separately, rather than correcting only parameter drift, while keeping aggregation additive for encryption.",
  },
  {
    title: "Multi-modal Alzheimer's detection",
    body: "Extending federated training beyond MRI to PET and clinical data, with attention to early-stage detection.",
  },
  {
    title: "Personalised federated learning",
    body: "Letting each site keep its own normalisation or classifier head while sharing a global backbone.",
  },
  {
    title: "Real multi-hospital evaluation",
    body: "Moving from simulation to real sites, where latency, client dropout and governance all matter.",
  },
];

export const dissertations = studies.filter((study) => study.kind.endsWith("dissertation"));

export const getStudy = (slug: string) => studies.find((study) => study.slug === slug);
