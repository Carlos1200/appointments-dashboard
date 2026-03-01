import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Destructure expected payload from n8n / RetellAI
    const { 
      patient_name, 
      patient_phone, 
      date, 
      time, 
      notes = '', 
      status = 'confirmed',
      source = 'RetellAI' 
    } = body;

    // Validate minimum required fields
    if (!patient_name || !patient_phone || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields (patient_name, patient_phone, date, time)' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { data, error } = await supabase.from('appointments').insert({
      patient_name,
      patient_phone,
      date,
      time,
      notes,
      status,
      source
    }).select();

    if (error) {
      console.error('Supabase error inserting via webhook:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return success
    return NextResponse.json(
      { message: 'Appointment created successfully', data: data?.[0] },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error processing webhook' },
      { status: 500 }
    );
  }
}
