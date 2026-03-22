export const mockUser = {
  nome: "Carolina",
  idade: 29,
  pesoAtual: 72.4,
  pesoInicial: 78.2,
  altura: 165,
  objetivo: "Emagrecer com saúde",
  meta: "Perder 8kg em 4 meses",
  nivelAtividade: "Moderado",
  rotina: "Trabalho de escritório",
  frequenciaTreino: "3x por semana",
  horarioTreino: "Manhã",
  preferenciasAlimentares: ["Sem glúten"],
  restricoes: ["Lactose"],
  alimentosGosta: ["Frango", "Abacate", "Ovos", "Batata doce"],
  alimentosNaoGosta: ["Beterraba", "Quiabo"],
  consumoAgua: "1.5L",
  mediaSono: "6h",
  maiorDificuldade: "Manter constância",
};

export const fraseDoDia = [
  "Cada pequeno passo conta. Você não precisa ser perfeita, só precisa ser constante.",
  "Cuidar de si é um ato de amor. Hoje é um bom dia para isso.",
  "Não é sobre velocidade. É sobre direção.",
  "Seu corpo é sua casa. Cuide dele com carinho.",
  "A mudança começa com uma escolha — e você já fez a sua.",
  "Progresso não é linear. Celebre cada vitória, por menor que pareça.",
  "Você merece se sentir bem no seu corpo todos os dias.",
  "A constância gentil transforma mais do que qualquer dieta radical.",
  "Hoje você pode escolher o que te faz bem. E isso já é muito.",
  "Não existe corpo errado. Existe corpo que merece mais atenção e cuidado.",
];

export const refeicoesDoDia = [
  {
    tipo: "Café da manhã",
    horario: "07:30",
    descricao: "Omelete de claras com espinafre + 1 fatia de pão integral + café com leite de amêndoas",
    calorias: 320,
    feito: true,
  },
  {
    tipo: "Lanche da manhã",
    horario: "10:00",
    descricao: "1 maçã + 10 castanhas de caju",
    calorias: 180,
    feito: true,
  },
  {
    tipo: "Almoço",
    horario: "12:30",
    descricao: "Frango grelhado + arroz integral + brócolis refogado + salada verde",
    calorias: 480,
    feito: false,
  },
  {
    tipo: "Lanche da tarde",
    horario: "15:30",
    descricao: "Iogurte natural sem lactose + granola + banana",
    calorias: 210,
    feito: false,
  },
  {
    tipo: "Jantar",
    horario: "19:00",
    descricao: "Sopa de legumes com frango desfiado + torrada integral",
    calorias: 350,
    feito: false,
  },
];

export const aguaDoDia = {
  meta: 2500,
  consumido: 1200,
  copos: 5,
  metaCopos: 10,
};

export const sonoDoDia = {
  horasDormidas: 6.5,
  metaHoras: 8,
  qualidade: "Regular",
  horaDormir: "23:30",
  horaAcordar: "06:00",
};

export const treinoDoDia = {
  tipo: "Treino de força — Membros inferiores",
  duracao: "40 min",
  nivel: "Moderado",
  exercicios: [
    { nome: "Agachamento livre", series: "3x15", feito: false },
    { nome: "Afundo alternado", series: "3x12", feito: false },
    { nome: "Elevação pélvica", series: "3x15", feito: false },
    { nome: "Panturrilha em pé", series: "3x20", feito: false },
    { nome: "Abdominais", series: "3x15", feito: false },
  ],
  feito: false,
};

export const progressoSemanal = {
  diasCompletos: 4,
  totalDias: 7,
  pesoInicio: 72.8,
  pesoAtual: 72.4,
  sequencia: 12,
  tarefas: {
    alimentacao: 85,
    agua: 70,
    treino: 66,
    sono: 55,
  },
};

export const checkInRapido = {
  pergunta: "Como você está se sentindo hoje?",
  opcoes: [
    { emoji: "😊", label: "Bem" },
    { emoji: "😐", label: "Normal" },
    { emoji: "😴", label: "Cansada" },
    { emoji: "💪", label: "Motivada" },
    { emoji: "😔", label: "Desanimada" },
  ],
};

export const onboardingSteps = [
  {
    id: "nome",
    titulo: "Como podemos te chamar?",
    subtitulo: "Queremos te conhecer melhor",
    tipo: "text" as const,
    campo: "nome",
    placeholder: "Seu nome",
  },
  {
    id: "idade",
    titulo: "Qual a sua idade?",
    subtitulo: "Isso nos ajuda a personalizar seu plano",
    tipo: "number" as const,
    campo: "idade",
    placeholder: "Ex: 28",
  },
  {
    id: "medidas",
    titulo: "Peso atual e altura",
    subtitulo: "Dados essenciais para o seu plano",
    tipo: "dual-number" as const,
    campos: [
      { campo: "peso", placeholder: "Peso (kg)", sufixo: "kg" },
      { campo: "altura", placeholder: "Altura (cm)", sufixo: "cm" },
    ],
  },
  {
    id: "objetivo",
    titulo: "Qual seu objetivo principal?",
    subtitulo: "Escolha o que mais faz sentido para você agora",
    tipo: "select" as const,
    campo: "objetivo",
    opcoes: ["Emagrecer com saúde", "Manter o peso", "Ganhar massa magra", "Melhorar a alimentação", "Ter mais disposição"],
  },
  {
    id: "meta",
    titulo: "Qual sua meta?",
    subtitulo: "Pode ser um número ou uma sensação",
    tipo: "select" as const,
    campo: "meta",
    opcoes: ["Perder 5kg", "Perder 8kg", "Perder 10kg+", "Sentir mais energia", "Caber nas roupas"],
  },
  {
    id: "atividade",
    titulo: "Qual seu nível de atividade?",
    subtitulo: "Seja sincera — estamos aqui para te ajudar",
    tipo: "select" as const,
    campo: "nivelAtividade",
    opcoes: ["Sedentária", "Levemente ativa", "Moderada", "Muito ativa"],
  },
  {
    id: "rotina",
    titulo: "Como é sua rotina?",
    subtitulo: "Entender seu dia nos ajuda a encaixar tudo",
    tipo: "select" as const,
    campo: "rotina",
    opcoes: ["Trabalho de escritório", "Trabalho em casa", "Trabalho físico", "Estudante", "Flexível"],
  },
  {
    id: "frequencia",
    titulo: "Quantas vezes por semana você treina?",
    subtitulo: "Ou gostaria de treinar",
    tipo: "select" as const,
    campo: "frequenciaTreino",
    opcoes: ["Não treino", "1-2x por semana", "3x por semana", "4-5x por semana", "Todos os dias"],
  },
  {
    id: "horario",
    titulo: "Qual horário prefere treinar?",
    subtitulo: "Vamos encaixar no melhor momento",
    tipo: "select" as const,
    campo: "horarioTreino",
    opcoes: ["Manhã", "Tarde", "Noite", "Qualquer horário"],
  },
  {
    id: "alimentacao",
    titulo: "Preferências alimentares",
    subtitulo: "Selecione tudo que se aplica",
    tipo: "multi-select" as const,
    campo: "preferenciasAlimentares",
    opcoes: ["Sem restrições", "Vegetariana", "Vegana", "Sem glúten", "Sem lactose", "Low carb"],
  },
  {
    id: "restricoes",
    titulo: "Tem alguma restrição ou alergia?",
    subtitulo: "Queremos manter você segura",
    tipo: "multi-select" as const,
    campo: "restricoes",
    opcoes: ["Nenhuma", "Lactose", "Glúten", "Frutos do mar", "Amendoim", "Ovo", "Outra"],
  },
  {
    id: "agua",
    titulo: "Quanto de água você bebe por dia?",
    subtitulo: "Hidratação é parte essencial do bem-estar",
    tipo: "select" as const,
    campo: "consumoAgua",
    opcoes: ["Menos de 1L", "1L a 1.5L", "1.5L a 2L", "Mais de 2L"],
  },
  {
    id: "sono",
    titulo: "Quantas horas você dorme em média?",
    subtitulo: "Sono de qualidade faz toda diferença",
    tipo: "select" as const,
    campo: "mediaSono",
    opcoes: ["Menos de 5h", "5h a 6h", "6h a 7h", "7h a 8h", "Mais de 8h"],
  },
  {
    id: "dificuldade",
    titulo: "Qual sua maior dificuldade?",
    subtitulo: "Saber disso nos ajuda a te apoiar melhor",
    tipo: "select" as const,
    campo: "maiorDificuldade",
    opcoes: ["Manter constância", "Controlar a alimentação", "Encontrar tempo para treinar", "Motivação", "Ansiedade com comida", "Dormir bem"],
  },
];
