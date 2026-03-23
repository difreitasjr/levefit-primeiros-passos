
CREATE UNIQUE INDEX IF NOT EXISTS meal_logs_user_date_tipo ON public.meal_logs (user_id, date, tipo_refeicao);
CREATE UNIQUE INDEX IF NOT EXISTS workout_logs_user_date ON public.workout_logs (user_id, date);
