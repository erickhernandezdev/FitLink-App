import { supabase } from "./supabase";

interface DeleteRoutineResult {
  success: boolean;
  error?: string;
}

export async function deleteRoutine(
  routineId: string,
): Promise<DeleteRoutineResult> {
  try {
    const { error } = await supabase
      .from("routines")
      .delete()
      .eq("routine_id", routineId);

    if (error) {
      console.error("Error eliminando rutina:", error);

      return {
        success: false,
        error: "No se pudo eliminar la rutina",
      };
    }

    return {
      success: true,
    };
  } catch (err) {
    console.error("Error inesperado:", err);

    return {
      success: false,
      error: "Ocurrió un error al eliminar la rutina",
    };
  }
}
