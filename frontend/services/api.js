
const API_BASE_URL = //use your IP 

async function handleResponse(response, fallbackMessage) {
  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(fallbackMessage);
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || fallbackMessage);
  }

  return data;
}

// LOGIN
export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.trim(),
      password,
    }),
  });

  return handleResponse(response, 'Login failed. Please try again.');
}

// REGISTER
export async function registerUser(displayName, email, password) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      display_name: displayName.trim(),
      email: email.trim(),
      password,
    }),
  });

  return handleResponse(
    response,
    'Registration failed. Please try again.'
  );
}

// SAVE MOOD CHECK-IN
export async function saveMoodCheckin(
  participantId,
  moodValue,
  feelings,
  note
) {
  const response = await fetch(`${API_BASE_URL}/checkins`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      participant_id: participantId,
      mood_value: moodValue,
      feelings,
      note: (note || '').trim(),
    }),
  });

  return handleResponse(
    response,
    'Could not save your check-in. Please try again.'
  );
}

// LOAD MOOD CHECK-INS
export async function getMoodCheckins(participantId) {
  const response = await fetch(
    `${API_BASE_URL}/checkins?participant_id=${encodeURIComponent(
      participantId
    )}`
  );

  return handleResponse(
    response,
    'Could not load your check-in history.'
  );
}

// LOAD MOOD TRENDS
// Connects to the existing Flask trends endpoint.
export async function getMoodTrends(participantId) {
  const response = await fetch(
    `${API_BASE_URL}/checkins/trends?participant_id=${encodeURIComponent(
      participantId
    )}`
  );

  return handleResponse(
    response,
    'Could not load your mood trends.'
  );
}


 // LOAD PERSONALIZED GUIDANCE RECOMMENDATIONS
export async function getGuidanceRecommendations(participantId) {
  const response = await fetch(
    `${API_BASE_URL}/guidance/recommendations?participant_id=${encodeURIComponent(
      participantId
    )}`
  );

  return handleResponse(
    response,
    'Could not load your guidance recommendations. Please try again.'
  );
}


//SEND A MESSAGE TO THE AI
//If conversationId is null, the backend creates a new conversation.
export async function sendWellnessMessage(
  participantId,
  questionText,
  conversationId = null
) {
  const body = {
    participant_id: participantId,
    question_text: questionText.trim(),
  };

  if (conversationId !== null) {
    body.conversation_id = conversationId;
  }

  const response = await fetch(`${API_BASE_URL}/wellness-chats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return handleResponse(
    response,
    'Could not send your message. Please try again.'
  );
}

// LOAD THE USER'S CONVERSATION LIST
export async function getWellnessConversations(participantId) {
  const response = await fetch(
    `${API_BASE_URL}/wellness-conversations?participant_id=${encodeURIComponent(
      participantId
    )}`
  );

  return handleResponse(
    response,
    'Could not load your conversations.'
  );
}

// LOAD MESSAGES FROM ONE CONVERSATION
export async function getWellnessChatHistory(
  participantId,
  conversationId
) {
  const response = await fetch(
    `${API_BASE_URL}/wellness-chats?participant_id=${encodeURIComponent(
      participantId
    )}&conversation_id=${encodeURIComponent(conversationId)}`
  );

  return handleResponse(
    response,
    'Could not load this conversation.'
  );
}

// DELETE A CONVERSATION AND ITS MESSAGES
export async function deleteWellnessConversation(
  participantId,
  conversationId
) {
  const response = await fetch(
    `${API_BASE_URL}/wellness-conversations/${encodeURIComponent(
      conversationId
    )}?participant_id=${encodeURIComponent(participantId)}`,
    {
      method: 'DELETE',
    }
  );

  return handleResponse(
    response,
    'Could not delete this conversation.'
  );
}
