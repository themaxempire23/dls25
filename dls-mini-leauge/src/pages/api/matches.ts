import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', ['POST']).status(405).end('Method Not Allowed');
  }

  const { gameweek, home_team, away_team, home_score, away_score } = req.body;

  const { error } = await supabase
    .from('match_results')
    .insert([{ gameweek, home_team, away_team, home_score, away_score }]);

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ success: true });
}
