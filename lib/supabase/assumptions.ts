import { supabase } from './client';
import { Assumptions } from '@/types/financial';

export async function loadAssumptions(): Promise<Assumptions | null> {
  try {
    const { data, error } = await supabase
      .from('assumptions')
      .select('data')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      console.error('Error loading assumptions:', error);
      return null;
    }

    return data?.data || null;
  } catch (error) {
    console.error('Error loading assumptions:', error);
    return null;
  }
}

export async function saveAssumptions(assumptions: Assumptions): Promise<boolean> {
  try {
    const { data: existing } = await supabase
      .from('assumptions')
      .select('id')
      .eq('id', 1)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('assumptions')
        .update({ data: assumptions })
        .eq('id', 1);

      if (error) {
        console.error('Error updating assumptions:', error);
        return false;
      }
    } else {
      const { error } = await supabase
        .from('assumptions')
        .insert({ id: 1, data: assumptions });

      if (error) {
        console.error('Error inserting assumptions:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error saving assumptions:', error);
    return false;
  }
}
