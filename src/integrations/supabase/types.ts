export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      daily_checkins: {
        Row: {
          agua: string | null
          alimentacao: string | null
          created_at: string
          date: string
          energia: number | null
          humor: string | null
          id: string
          nota: string | null
          sono: string | null
          treino: string | null
          user_id: string
        }
        Insert: {
          agua?: string | null
          alimentacao?: string | null
          created_at?: string
          date?: string
          energia?: number | null
          humor?: string | null
          id?: string
          nota?: string | null
          sono?: string | null
          treino?: string | null
          user_id: string
        }
        Update: {
          agua?: string | null
          alimentacao?: string | null
          created_at?: string
          date?: string
          energia?: number | null
          humor?: string | null
          id?: string
          nota?: string | null
          sono?: string | null
          treino?: string | null
          user_id?: string
        }
        Relationships: []
      }
      meal_logs: {
        Row: {
          calorias: number | null
          carbs: number | null
          concluida: boolean
          created_at: string
          date: string
          descricao: string | null
          favorita: boolean
          gordura: number | null
          id: string
          proteina: number | null
          tipo_refeicao: string
          user_id: string
        }
        Insert: {
          calorias?: number | null
          carbs?: number | null
          concluida?: boolean
          created_at?: string
          date?: string
          descricao?: string | null
          favorita?: boolean
          gordura?: number | null
          id?: string
          proteina?: number | null
          tipo_refeicao: string
          user_id: string
        }
        Update: {
          calorias?: number | null
          carbs?: number | null
          concluida?: boolean
          created_at?: string
          date?: string
          descricao?: string | null
          favorita?: boolean
          gordura?: number | null
          id?: string
          proteina?: number | null
          tipo_refeicao?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_answers: {
        Row: {
          answers: Json
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          answers?: Json
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          alimentos_gosta: string[] | null
          alimentos_nao_gosta: string[] | null
          altura: number | null
          consumo_agua: string | null
          created_at: string
          frequencia_treino: string | null
          horario_treino: string | null
          id: string
          idade: number | null
          maior_dificuldade: string | null
          media_sono: string | null
          meta: string | null
          nivel_atividade: string | null
          nome: string | null
          objetivo: string | null
          onboarding_completed: boolean
          peso_atual: number | null
          peso_inicial: number | null
          preferencias_alimentares: string[] | null
          restricoes: string[] | null
          rotina: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alimentos_gosta?: string[] | null
          alimentos_nao_gosta?: string[] | null
          altura?: number | null
          consumo_agua?: string | null
          created_at?: string
          frequencia_treino?: string | null
          horario_treino?: string | null
          id?: string
          idade?: number | null
          maior_dificuldade?: string | null
          media_sono?: string | null
          meta?: string | null
          nivel_atividade?: string | null
          nome?: string | null
          objetivo?: string | null
          onboarding_completed?: boolean
          peso_atual?: number | null
          peso_inicial?: number | null
          preferencias_alimentares?: string[] | null
          restricoes?: string[] | null
          rotina?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alimentos_gosta?: string[] | null
          alimentos_nao_gosta?: string[] | null
          altura?: number | null
          consumo_agua?: string | null
          created_at?: string
          frequencia_treino?: string | null
          horario_treino?: string | null
          id?: string
          idade?: number | null
          maior_dificuldade?: string | null
          media_sono?: string | null
          meta?: string | null
          nivel_atividade?: string | null
          nome?: string | null
          objetivo?: string | null
          onboarding_completed?: boolean
          peso_atual?: number | null
          peso_inicial?: number | null
          preferencias_alimentares?: string[] | null
          restricoes?: string[] | null
          rotina?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      progress_logs: {
        Row: {
          braco: number | null
          cintura: number | null
          coxa: number | null
          created_at: string
          date: string
          id: string
          nota: string | null
          peso: number | null
          quadril: number | null
          user_id: string
        }
        Insert: {
          braco?: number | null
          cintura?: number | null
          coxa?: number | null
          created_at?: string
          date?: string
          id?: string
          nota?: string | null
          peso?: number | null
          quadril?: number | null
          user_id: string
        }
        Update: {
          braco?: number | null
          cintura?: number | null
          coxa?: number | null
          created_at?: string
          date?: string
          id?: string
          nota?: string | null
          peso?: number | null
          quadril?: number | null
          user_id?: string
        }
        Relationships: []
      }
      workout_logs: {
        Row: {
          concluido: boolean
          created_at: string
          date: string
          duracao: string | null
          exercicios_feitos: Json | null
          id: string
          nota: string | null
          tipo: string
          user_id: string
        }
        Insert: {
          concluido?: boolean
          created_at?: string
          date?: string
          duracao?: string | null
          exercicios_feitos?: Json | null
          id?: string
          nota?: string | null
          tipo: string
          user_id: string
        }
        Update: {
          concluido?: boolean
          created_at?: string
          date?: string
          duracao?: string | null
          exercicios_feitos?: Json | null
          id?: string
          nota?: string | null
          tipo?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
