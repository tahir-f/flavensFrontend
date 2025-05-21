import { Client, Account, Databases, ID, Query } from 'appwrite';

console.log('[Appwrite] Initializing client...');
const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

console.log('[Appwrite] Initializing services...');
const account = new Account(client);
const databases = new Databases(client);

const DATABASE_ID = '68295a2800232b646b55';
const USERS_COLLECTION_ID = '68295f6d000d695d2391';
const MENU_ITEMS_COLLECTION_ID = '6829602f001401523ee5';
const ORDERS_COLLECTION_ID = '68296043001f2c2c71c3';
const RESERVATIONS_COLLECTION_ID = '682960590003cf5f2465';
const DAILY_MENUS_COLLECTION_ID = '68296107001e98edefae';
const FEEDBACK_COLLECTION_ID = '682960c3000978177a3d';
const AI_SESSIONS_COLLECTION_ID = '6829612a0006eb27c38e';
const TABLES_COLLECTION_ID = '6829606b0033b306dc3c'; // Replace with actual ID

const createAccount = async (email: string, password: string, name: string) => {
  try {
    console.log('[createAccount] Creating account:', { email, name });
    const newAccount = await account.create(ID.unique(), email, password, name);
    console.log('[createAccount] New account:', newAccount);
    if (!newAccount) throw new Error('Account creation failed');

    const session = await account.createEmailSession(email, password);
    console.log('[createAccount] Session:', session);
    if (!session) throw new Error('Login after signup failed');

    const userProfileData = {
      user_id: newAccount.$id,
      email: email,
      username: name,
      role: 'customer',
      created_at: new Date().toISOString(),
      user_context: JSON.stringify({
        preferences: [],
        allergies: [],
        favorite_items: []
      })
    };
    console.log('[createAccount] Creating user profile:', userProfileData);

    const userProfile = await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      ID.unique(),
      userProfileData
    );
    console.log('[createAccount] User profile created:', userProfile);

    return { account: newAccount, session, userProfile };
  } catch (error) {
    console.error('❌ Error during createAccount:', error);
    throw error;
  }
};

const login = async (email: string, password: string) => {
  try {
    console.log('[login] Logging in:', { email });
    const session = await account.createEmailSession(email, password);
    console.log('[login] Session:', session);
    return session;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

const logout = async () => {
  try {
    console.log('[logout] Logging out current session');
    const result = await account.deleteSession('current');
    console.log('[logout] Logout result:', result);
    return result;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

const getCurrentUser = async () => {
  try {
    console.log('[getCurrentUser] Getting current user');
    const user = await account.get();
    console.log('[getCurrentUser] Auth user:', user);
    if (!user) return null;
    
    const userData = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('user_id', user.$id)]
    );
    console.log('[getCurrentUser] User profile data:', userData);

    if (userData.documents.length > 0) {
      return { ...user, ...userData.documents[0] };
    }
    return user;
  } catch (error) {
    if (error instanceof Error && error.message.includes('401')) {
      console.warn('[getCurrentUser] Not authenticated');
      return null;
    }
    console.error('Error getting current user:', error);
    throw error;
  }
};

const getUserRole = async (userId: string) => {
  try {
    console.log('[getUserRole] Getting role for user:', userId);
    const users = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('user_id', userId)]
    );
    console.log('[getUserRole] Found users:', users);

    if (users.documents.length > 0) {
      return users.documents[0].role;
    }
    return null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

const getMenuItems = async (filters: { category?: string; maxPrice?: number; tags?: string[] } = {}) => {
  try {
    console.log('[getMenuItems] Filters:', filters);
    const queries: string[] = [];
    if (filters.category) {
      queries.push(Query.equal('category', filters.category));
    }
    if (filters.maxPrice) {
      queries.push(Query.lessThanEqual('price', filters.maxPrice));
    }
    if (filters.tags && filters.tags.length > 0) {
      queries.push(Query.search('tags', filters.tags.join(' ')));
    }
    const result = await databases.listDocuments(
      DATABASE_ID,
      MENU_ITEMS_COLLECTION_ID,
      queries
    );
    console.log('[getMenuItems] Result:', result);
    return result;
  } catch (error) {
    console.error('Error getting menu items:', error);
    throw error;
  }
};

const getDailyMenus = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log('[getDailyMenus] Today:', today);
    const result = await databases.listDocuments(
      DATABASE_ID,
      DAILY_MENUS_COLLECTION_ID,
      [Query.equal('date', today)]
    );
    console.log('[getDailyMenus] Result:', result);
    return result;
  } catch (error) {
    console.error('Error getting daily menus:', error);
    throw error;
  }
};

const createOrder = async (userId: string, items: any[], total: number) => {
  try {
    console.log('[createOrder] Creating order:', { userId, items, total });
    const orderData = {
      user_id: userId,
      items: JSON.stringify(items),
      total_price: total,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    const result = await databases.createDocument(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      ID.unique(),
      orderData
    );
    console.log('[createOrder] Order created:', result);
    return result;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

const getUserOrders = async (userId: string) => {
  try {
    console.log('[getUserOrders] Getting orders for user:', userId);
    const result = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.equal('user_id', userId), Query.orderDesc('created_at')]
    );
    console.log('[getUserOrders] Result:', result);
    return result;
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};

const createReservation = async (
  userId: string,
  date: string,
  time: string,
  guests: number,
  notes: string
) => {
  try {
    // 1. Find an available table with enough capacity
    const tablesResult = await databases.listDocuments(
      DATABASE_ID,
      TABLES_COLLECTION_ID,
      [
        Query.equal('status', 'available'),
        Query.greaterThanEqual('capacity', guests)
      ]
    );
    if (!tablesResult.documents.length) {
      throw new Error('No available table found for the requested number of guests.');
    }
    const table = tablesResult.documents[0];

    // 2. Create the reservation with the selected table_id
    console.log('[createReservation] Creating reservation:', { userId, date, time, guests, notes, table_id: table.$id });
    const reservationData = {
  user_id: userId,
  date: date,
  time: time,
  guest_count: guests,
  special_requests: notes, // <-- use special_requests instead of notes
  table_id: table.$id,
  status: 'pending',
  created_at: new Date().toISOString()
};
    const result = await databases.createDocument(
      DATABASE_ID,
      RESERVATIONS_COLLECTION_ID,
      ID.unique(),
      reservationData
    );
    console.log('[createReservation] Reservation created:', result);
    return result;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};
const getUserReservations = async (userId: string) => {
  try {
    console.log('[getUserReservations] Getting reservations for user:', userId);
    const result = await databases.listDocuments(
      DATABASE_ID,
      RESERVATIONS_COLLECTION_ID,
      [Query.equal('user_id', userId), Query.orderDesc('date')]
    );
    console.log('[getUserReservations] Result:', result);
    return result;
  } catch (error) {
    console.error('Error getting user reservations:', error);
    throw error;
  }
};

const submitFeedback = async (userId: string, orderId: string, rating: number, comment: string) => {
  try {
    console.log('[submitFeedback] Submitting feedback:', { userId, orderId, rating, comment });
    const feedbackData = {
      user_id: userId,
      order_id: orderId,
      rating: rating,
      comment: comment,
      created_at: new Date().toISOString()
    };
    const result = await databases.createDocument(
      DATABASE_ID,
      FEEDBACK_COLLECTION_ID,
      ID.unique(),
      feedbackData
    );
    console.log('[submitFeedback] Feedback submitted:', result);
    return result;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

const updateUserProfile = async (userId: string, data: any) => {
  try {
    console.log('[updateUserProfile] Updating profile for:', userId, 'with data:', data);
    const users = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('user_id', userId)]
    );
    console.log('[updateUserProfile] Query result:', users);

    if (users.documents.length > 0) {
      const userDoc = users.documents[0];
      console.log('[updateUserProfile] Found userDoc:', userDoc);
      const result = await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userDoc.$id,
        data
      );
      console.log('[updateUserProfile] Update result:', result);
      return result;
    }

    // Auto-create profile if not found
    console.warn('[updateUserProfile] User profile not found for userId:', userId, 'Creating new profile...');
    const { name, ...filteredData } = data;
const newProfileData = {
  user_id: userId,
  ...filteredData,
  created_at: new Date().toISOString(),
  role: filteredData.role || 'customer',
  username: filteredData.username || '',
  email: filteredData.email || '',
  user_context: filteredData.user_context || JSON.stringify({
    preferences: [],
    allergies: [],
    favorite_items: []
  })
};
// Remove 'name' if it exists in data
if ('name' in newProfileData) delete newProfileData.name;
    const newProfile = await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      ID.unique(),
      newProfileData
    );
    console.log('[updateUserProfile] Created new user profile:', newProfile);
    return newProfile;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

const getTables = async () => {
  return await databases.listDocuments(DATABASE_ID, TABLES_COLLECTION_ID);
};

export {
  createAccount,
  login,
  logout,
  getCurrentUser,
  getUserRole,
  getMenuItems,
  getDailyMenus,
  createOrder,
  getUserOrders,
  createReservation,
  getUserReservations,
  submitFeedback,
  updateUserProfile,
  getTables
};