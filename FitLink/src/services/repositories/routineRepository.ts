import { supabase } from "../supabase";

export async function getRoutinesByUserId(userId: number) {
  const { data, error } = await supabase
    .from("routines")
    .select(
      `
      routine_id,
      name,
      description,
      is_shared,
      created_at,
      user_id,
      estimated_time,
      routine_exercises (
        exercise_id
      )
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { routines: data, error };
}

export async function getRoutineById(routineId: string) {
  const { data, error } = await supabase
    .from("routines")
    .select(
      `
      routine_id,
      name,
      description,
      created_at,
      estimated_time,
      is_shared,
      routine_exercises (
        routine_exercise_id,
        order,
        sets,
        exercises (
          exercise_id,
          name,
          description
        )
      )
    `,
    )
    .eq("routine_id", routineId)
    .single();

  return { routine: data, error };
}

export async function createRoutine(
  userId: number,
  routineData: {
    name: string;
    description: string;
    estimated_time: number;
    is_shared: boolean;
  },
) {
  const { data, error } = await supabase
    .from("routines")
    .insert({ ...routineData, user_id: userId })
    .select()
    .single();

  return { routine: data, error };
}

export async function updateRoutine(
  routineId: string,
  routineData: {
    name: string;
    description: string;
    estimated_time: number;
    is_shared: boolean;
  },
) {
  const { error } = await supabase
    .from("routines")
    .update(routineData)
    .eq("routine_id", routineId);

  return { error };
}

export async function deleteRoutine(routineId: string) {
  const { error } = await supabase
    .from("routines")
    .delete()
    .eq("routine_id", routineId);

  return { error };
}

export async function getSharedRoutines(userId: number) {
  const { data, error } = await supabase
    .from("routines")
    .select(
      `
      routine_id,
      name,
      description,
      is_shared,
      downloads,
      created_at,
      user_id,
      estimated_time,
      users (
        username
      ),
      routine_exercises (
        exercise_id
      )
    `,
    )
    .eq("is_shared", true)
    .is("source_routine_id", null)
    .neq("user_id", userId)
    .order("downloads", { ascending: false });

  return { routines: data, error };
}

export async function getSharedRoutineById(routineId: string | number) {
  const { data, error } = await supabase
    .from("routines")
    .select(
      `
      routine_id,
      name,
      description,
      created_at,
      estimated_time,
      is_shared,
      downloads,
      user_id,
      users (
        username
      ),
      routine_exercises (
        routine_exercise_id,
        order,
        sets,
        exercises (
          exercise_id,
          name,
          description
        )
      )
    `,
    )
    .eq("routine_id", routineId)
    .eq("is_shared", true)
    .is("source_routine_id", null)
    .single();

  return { routine: data, error };
}

export async function isRoutineAlreadyCloned(
  sourceRoutineId: string | number,
  userId: string | number,
) {
  const { data: originalRoutine, error: ownerError } = await supabase
    .from("routines")
    .select("user_id")
    .eq("routine_id", sourceRoutineId)
    .maybeSingle();

  if (ownerError) {
    return { isCloned: false, clonedRoutineId: undefined, error: ownerError };
  }

  if (originalRoutine?.user_id === userId) {
    return { isCloned: true, clonedRoutineId: undefined, error: null };
  }

  const { data, error } = await supabase
    .from("routines")
    .select("routine_id")
    .eq("source_routine_id", sourceRoutineId)
    .eq("user_id", userId)
    .eq("is_external", true)
    .maybeSingle();

  return {
    isCloned: !!data,
    clonedRoutineId: data?.routine_id,
    error,
  };
}

export async function clonePublicRoutine(
  sourceRoutineId: string | number,
  targetUserId: string | number,
) {
  const { routine: sourceRoutine, error: fetchError } =
    await getSharedRoutineById(sourceRoutineId);

  if (fetchError || !sourceRoutine) {
    return { error: fetchError || new Error("Rutina no encontrada") };
  }

  const { data: newRoutine, error: createError } = await supabase
    .from("routines")
    .insert({
      name: sourceRoutine.name,
      description: sourceRoutine.description,
      is_shared: false,
      is_external: true,
      source_routine_id: sourceRoutine.routine_id,
      user_id: targetUserId,
      estimated_time: sourceRoutine.estimated_time,
      downloads: 0,
    })
    .select("routine_id")
    .single();

  if (createError || !newRoutine) {
    return { error: createError };
  }

  const exercisesToInsert = sourceRoutine.routine_exercises.map((re: any) => ({
    routine_id: newRoutine.routine_id,
    exercise_id: re.exercises.exercise_id,
    order: re.order,
    sets: re.sets,
  }));

  if (exercisesToInsert.length > 0) {
    const { error: exercisesError } = await supabase
      .from("routine_exercises")
      .insert(exercisesToInsert);

    if (exercisesError) {
      return { error: exercisesError };
    }
  }

  await incrementRoutineDownloads(sourceRoutineId);

  return { newRoutineId: newRoutine.routine_id, error: null };
}

export async function incrementRoutineDownloads(routineId: string | number) {
  const { error } = await supabase.rpc("increment_routine_downloads", {
    routine_id_param: Number(routineId),
  });

  return { error };
}

export async function getPopularRoutines(limit = 10, userId: number) {
  const { data, error } = await supabase
    .from("routines")
    .select(
      `
      routine_id,
      name,
      description,
      is_shared,
      downloads,
      created_at,
      user_id,
      estimated_time,
      users!routines_user_id_fkey (
        username
      ),
      routine_exercises (
        exercise_id
      )
    `,
    )
    .eq("is_shared", true)
    .is("source_routine_id", null)
    .neq("user_id", userId)
    .order("downloads", { ascending: false })
    .limit(limit);

  return { routines: data, error };
}

export async function getRecentRoutines(limit = 10, userId: number) {
  const { data, error } = await supabase
    .from("routines")
    .select(
      `
      routine_id,
      name,
      description,
      is_shared,
      downloads,
      created_at,
      user_id,
      estimated_time,
      users!routines_user_id_fkey (
        username
      ),
      routine_exercises (
        exercise_id
      )
    `,
    )
    .eq("is_shared", true)
    .is("source_routine_id", null)
    .neq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { routines: data, error };
}

export async function getTeamRoutines(limit = 10) {
  const { data, error } = await supabase
    .from("routines")
    .select(
      `
      routine_id,
      name,
      description,
      is_shared,
      downloads,
      created_at,
      user_id,
      estimated_time,
      users!routines_user_id_fkey!inner (
        username
      ),
      routine_exercises (
        exercise_id
      )
    `,
    )
    .eq("is_shared", true)
    .is("source_routine_id", null)
    .eq("users.username", "fitlink_team")
    .order("created_at", { ascending: false })
    .limit(limit);

  return { routines: data, error };
}
