'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Gig, Proposal, Order, Review, WalletTransaction, UserRole } from '@/types';
import { MOCK_USERS, MOCK_GIGS, MOCK_PROPOSALS, MOCK_ORDERS, MOCK_REVIEWS, MOCK_TRANSACTIONS } from './mockData';
import { supabase, isSupabaseConfigured } from './supabase';

export interface RegisterUserInput {
  full_name: string;
  email: string;
  password?: string;
  college_name: string;
  branch: string;
  year: string;
  role: UserRole;
  skills?: string[];
}

interface MarketplaceContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  isAuthenticated: boolean;
  loginUser: (emailOrId: string, pass?: string) => boolean;
  registerUser: (input: RegisterUserInput) => UserProfile;
  logoutUser: () => void;
  switchUser: (userId: string) => void;
  updateCurrentUserProfile: (updates: Partial<UserProfile>) => void;
  gigs: Gig[];
  postGig: (newGig: Omit<Gig, 'id' | 'client_id' | 'created_at' | 'status' | 'proposals_count'>) => Gig;
  deleteGig: (gigId: string) => void;
  clearAllGigs: () => void;
  proposals: Proposal[];
  submitProposal: (proposal: Omit<Proposal, 'id' | 'freelancer_id' | 'created_at' | 'status'>) => Proposal;
  acceptProposal: (proposalId: string) => Order | null;
  orders: Order[];
  getOrderById: (orderId: string) => Order | undefined;
  submitDeliverable: (orderId: string, note: string, links: { title: string; url: string }[]) => void;
  approveOrder: (orderId: string) => void;
  sendOrderMessage: (orderId: string, messageText: string, attachmentName?: string, attachmentUrl?: string) => void;
  reviews: Review[];
  submitReview: (review: Omit<Review, 'id' | 'reviewer_id' | 'created_at'>) => void;
  transactions: WalletTransaction[];
  addFundsToWallet: (amount: number, method: string) => WalletTransaction;
  withdrawFunds: (amount: number, upiId: string) => boolean;
  addNavCoins: (coins: number, source: string) => void;
  convertNavCoinsToRupees: (coinsToConvert: number) => boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isRealSupabase: boolean;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

function safeSave(key: string, value: unknown) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (e) {
    console.warn(`Failed to save ${key} to localStorage`, e);
  }
}

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS[0]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [gigs, setGigs] = useState<Gig[]>(MOCK_GIGS);
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(MOCK_TRANSACTIONS);
  const isRealSupabase = isSupabaseConfigured();

  // Load persisted theme, auth, and live student tasks from localStorage & Supabase
  useEffect(() => {
    const stored = localStorage.getItem('hw_theme') || localStorage.getItem('hw_paavs_theme') || localStorage.getItem('peerwork_theme');
    const initialTheme: 'light' | 'dark' = stored === 'light' ? 'light' : 'dark';
    setTheme(initialTheme);
    document.documentElement.classList.add('dark');

    const savedAuth = localStorage.getItem('hw_paavs_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }

    try {
      const savedUsers = localStorage.getItem('hw_paavs_all_users');
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
          setAllUsers(parsedUsers);
        }
      }

      const savedUser = localStorage.getItem('hw_paavs_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
      }

      const savedGigs = localStorage.getItem('peerwork_gigs');
      if (savedGigs !== null) {
        setGigs(JSON.parse(savedGigs));
      }

      const savedProposals = localStorage.getItem('peerwork_proposals');
      if (savedProposals !== null) {
        setProposals(JSON.parse(savedProposals));
      }

      const savedOrders = localStorage.getItem('peerwork_orders');
      if (savedOrders !== null) {
        setOrders(JSON.parse(savedOrders));
      }

      const savedReviews = localStorage.getItem('peerwork_reviews');
      if (savedReviews !== null) {
        setReviews(JSON.parse(savedReviews));
      }

      const savedTransactions = localStorage.getItem('peerwork_transactions');
      if (savedTransactions !== null) {
        setTransactions(JSON.parse(savedTransactions));
      }
    } catch (e) {
      console.error('Failed to load persisted data', e);
    }

    // If Supabase is configured, also sync live gigs and session from Supabase
    if (isRealSupabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (data?.session?.user) {
          setIsAuthenticated(true);
          localStorage.setItem('hw_paavs_auth', 'true');
        }
      });

      supabase
        .from('gigs')
        .select('*, client:profiles(*)')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setGigs((prev) => {
              const existingIds = new Set(prev.map((g) => g.id));
              const merged = [...prev];
              for (const row of data as unknown as Gig[]) {
                if (!existingIds.has(row.id)) {
                  merged.unshift(row);
                }
              }
              safeSave('peerwork_gigs', merged);
              return merged;
            });
          }
        });
    }
  }, [isRealSupabase]);

  const loginUser = (emailOrId: string, pass?: string): boolean => {
    const trimmed = emailOrId.trim();
    if (!trimmed) return false;

    const matched = allUsers.find(
      (u) => u.email.toLowerCase() === trimmed.toLowerCase() || u.id === trimmed
    );

    const userToSet: UserProfile = matched || {
      ...MOCK_USERS[0],
      id: `usr_${Date.now()}`,
      email: trimmed.includes('@') ? trimmed : `${trimmed}@iitd.ac.in`,
      full_name: trimmed
        .split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      wallet_balance: 2500,
      nav_coins: 25000,
      verified_student: true,
    };

    if (!matched) {
      setAllUsers((prev) => {
        const updated = [userToSet, ...prev];
        safeSave('hw_paavs_all_users', updated);
        return updated;
      });
    }

    setCurrentUser(userToSet);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('hw_paavs_auth', 'true');
      safeSave('hw_paavs_user', userToSet);
    } catch (e) {}

    if (isRealSupabase && pass) {
      supabase.auth.signInWithPassword({
        email: userToSet.email,
        password: pass,
      }).catch(() => {});
    }

    return true;
  };

  const registerUser = (input: RegisterUserInput): UserProfile => {
    const existing = allUsers.find(
      (u) => u.email.toLowerCase() === input.email.trim().toLowerCase()
    );

    const newUser: UserProfile = {
      id: existing?.id || `usr_${Date.now()}`,
      full_name: input.full_name.trim(),
      email: input.email.trim().toLowerCase(),
      avatar_url:
        existing?.avatar_url ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(input.full_name.trim())}`,
      college_name: input.college_name,
      branch: input.branch,
      year: input.year,
      role: input.role,
      bio: `Verified ${input.year} ${input.branch} student at ${input.college_name}. Ready to collaborate on campus tasks.`,
      skills: input.skills && input.skills.length > 0 ? input.skills : ['React', 'Next.js', 'TypeScript', 'Python', 'UI/UX'],
      portfolio_links: [
        { title: 'GitHub Profile', url: 'https://github.com' },
      ],
      rating_average: 5.0,
      rating_count: 1,
      verified_student: true,
      wallet_balance: existing ? existing.wallet_balance : 2500,
      nav_coins: existing ? existing.nav_coins : 25000,
      total_earned: existing ? existing.total_earned : 0,
      total_spent: existing ? existing.total_spent : 0,
      created_at: new Date().toISOString(),
    };

    setAllUsers((prev) => {
      const filtered = prev.filter((u) => u.id !== newUser.id);
      const updated = [newUser, ...filtered];
      safeSave('hw_paavs_all_users', updated);
      return updated;
    });

    setCurrentUser(newUser);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('hw_paavs_auth', 'true');
      safeSave('hw_paavs_user', newUser);
    } catch (e) {}

    if (!existing) {
      const welcomeTx: WalletTransaction = {
        id: `tx_welcome_${Date.now()}`,
        user_id: newUser.id,
        amount: 2500,
        type: 'credit',
        description: 'Campus Starter Bonus Credit (Verified Student Signup)',
        created_at: new Date().toISOString(),
      };
      setTransactions((prev) => {
        const updated = [welcomeTx, ...prev];
        safeSave('peerwork_transactions', updated);
        return updated;
      });
    }

    if (isRealSupabase && input.password) {
      supabase.auth
        .signUp({
          email: newUser.email,
          password: input.password,
          options: {
            data: {
              full_name: newUser.full_name,
              college_name: newUser.college_name,
              branch: newUser.branch,
              year: newUser.year,
              role: newUser.role,
            },
          },
        })
        .catch(() => {});
    }

    return newUser;
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('hw_paavs_auth');
    } catch (e) {}
    if (isRealSupabase) {
      supabase.auth.signOut().catch(() => {});
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('peerwork_theme', next);
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const switchUser = (userId: string) => {
    const target = allUsers.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setIsAuthenticated(true);
      localStorage.setItem('hw_paavs_auth', 'true');
      safeSave('hw_paavs_user', target);
    }
  };

  const updateCurrentUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updates };
      safeSave('hw_paavs_user', updated);
      setAllUsers((users) => {
        const nextUsers = users.map((u) => (u.id === prev.id ? updated : u));
        safeSave('hw_paavs_all_users', nextUsers);
        return nextUsers;
      });
      if (isRealSupabase) {
        supabase
          .from('profiles')
          .upsert({
            id: updated.id,
            email: updated.email,
            full_name: updated.full_name,
            college_name: updated.college_name,
            branch: updated.branch,
            year: updated.year,
            role: updated.role,
            bio: updated.bio,
            skills: updated.skills,
            wallet_balance: updated.wallet_balance,
            nav_coins: updated.nav_coins,
          })
          .then(() => {});
      }
      return updated;
    });
  };

  // Post a new Gig (Client Flow)
  const postGig = (gigInput: Omit<Gig, 'id' | 'client_id' | 'created_at' | 'status' | 'proposals_count'>): Gig => {
    const newGig: Gig = {
      ...gigInput,
      id: `gig_${Date.now()}`,
      client_id: currentUser.id,
      client: currentUser,
      status: 'open',
      proposals_count: 0,
      created_at: new Date().toISOString(),
    };

    setGigs((prev) => {
      const updated = [newGig, ...prev];
      safeSave('peerwork_gigs', updated);
      return updated;
    });

    if (isRealSupabase) {
      supabase
        .from('gigs')
        .insert({
          title: newGig.title,
          description: newGig.description,
          category: newGig.category,
          required_skills: newGig.required_skills,
          budget: newGig.budget,
          currency: newGig.currency,
          turnaround_time: newGig.turnaround_time,
          deadline: newGig.deadline,
          status: 'open',
        })
        .then(() => {});
    }

    return newGig;
  };

  // Delete a specific gig
  const deleteGig = (gigId: string) => {
    setGigs((prev) => {
      const updated = prev.filter((g) => g.id !== gigId);
      safeSave('peerwork_gigs', updated);
      return updated;
    });
    setProposals((prev) => {
      const updated = prev.filter((p) => p.gig_id !== gigId);
      safeSave('peerwork_proposals', updated);
      return updated;
    });
  };

  // Clear all gigs
  const clearAllGigs = () => {
    setGigs([]);
    setProposals([]);
    safeSave('peerwork_gigs', []);
    safeSave('peerwork_proposals', []);
  };

  // Submit Proposal (Freelancer Flow)
  const submitProposal = (proposalInput: Omit<Proposal, 'id' | 'freelancer_id' | 'created_at' | 'status'>): Proposal => {
    const newProposal: Proposal = {
      ...proposalInput,
      id: `prop_${Date.now()}`,
      freelancer_id: currentUser.id,
      freelancer: currentUser,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    setProposals((prev) => {
      const updated = [newProposal, ...prev];
      safeSave('peerwork_proposals', updated);
      return updated;
    });

    // Update proposal count on gig
    setGigs((prev) => {
      const updated = prev.map((g) =>
        g.id === proposalInput.gig_id ? { ...g, proposals_count: (g.proposals_count || 0) + 1 } : g
      );
      safeSave('peerwork_gigs', updated);
      return updated;
    });

    return newProposal;
  };

  // Hire Freelancer & Create Order (Client Flow)
  const acceptProposal = (proposalId: string): Order | null => {
    const proposal = proposals.find((p) => p.id === proposalId);
    if (!proposal) return null;

    const gig = gigs.find((g) => g.id === proposal.gig_id);
    if (!gig) return null;

    const orderAmount = proposal.bid_amount;

    // Mark proposal accepted
    setProposals((prev) => {
      const updated = prev.map((p) =>
        p.id === proposalId
          ? { ...p, status: 'accepted' as const }
          : p.gig_id === gig.id
          ? { ...p, status: 'rejected' as const }
          : p
      );
      safeSave('peerwork_proposals', updated);
      return updated;
    });

    // Update gig status
    setGigs((prev) => {
      const updated = prev.map((g) => (g.id === gig.id ? { ...g, status: 'in_progress' as const } : g));
      safeSave('peerwork_gigs', updated);
      return updated;
    });

    const orderId = `ord_${Date.now()}`;
    const newOrder: Order = {
      id: orderId,
      gig_id: gig.id,
      gig: { ...gig, status: 'in_progress' },
      client_id: gig.client_id,
      client: gig.client || currentUser,
      freelancer_id: proposal.freelancer_id,
      freelancer: proposal.freelancer || allUsers.find((u) => u.id === proposal.freelancer_id),
      proposal_id: proposal.id,
      amount: orderAmount,
      status: 'active',
      messages: [
        {
          id: `msg_init_${Date.now()}`,
          order_id: orderId,
          sender_id: gig.client_id,
          sender: gig.client || currentUser,
          message: `Hello! I have accepted your proposal for "${gig.title}". Escrow of ₹${orderAmount} is locked. Looking forward to collaborating!`,
          created_at: new Date().toISOString(),
        },
      ],
      created_at: new Date().toISOString(),
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      safeSave('peerwork_orders', updated);
      return updated;
    });

    // Escrow transaction record
    const escrowTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      user_id: gig.client_id,
      order_id: newOrder.id,
      amount: orderAmount,
      type: 'escrow_hold',
      description: `Escrow locked for project: ${gig.title}`,
      created_at: new Date().toISOString(),
    };
    setTransactions((prev) => {
      const updated = [escrowTx, ...prev];
      safeSave('peerwork_transactions', updated);
      return updated;
    });

    // Deduct from client's wallet into escrow
    setCurrentUser((prev) => {
      const updated = {
        ...prev,
        wallet_balance: Math.max(0, prev.wallet_balance - orderAmount),
        total_spent: prev.total_spent + orderAmount,
      };
      safeSave('hw_paavs_user', updated);
      return updated;
    });

    return newOrder;
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId);
  };

  // Freelancer submits deliverables
  const submitDeliverable = (orderId: string, note: string, links: { title: string; url: string }[]) => {
    setOrders((prev) => {
      const updated = prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'delivered' as const,
            deliverable_note: note,
            deliverable_links: links,
            submitted_at: new Date().toISOString(),
          };
        }
        return ord;
      });
      safeSave('peerwork_orders', updated);
      return updated;
    });
  };

  // Client approves deliverable and releases escrow payment
  const approveOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    setOrders((prev) => {
      const updated = prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'completed' as const,
            completed_at: new Date().toISOString(),
          };
        }
        return ord;
      });
      safeSave('peerwork_orders', updated);
      return updated;
    });

    // Update Gig status to completed
    setGigs((prev) => {
      const updated = prev.map((g) => (g.id === order.gig_id ? { ...g, status: 'completed' as const } : g));
      safeSave('peerwork_gigs', updated);
      return updated;
    });

    // Release escrow to freelancer
    const payoutTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      user_id: order.freelancer_id,
      order_id: order.id,
      amount: order.amount,
      type: 'escrow_release',
      description: `Escrow payout released for #${order.id.slice(-4)} (${order.gig?.title || 'Project'})`,
      created_at: new Date().toISOString(),
    };
    setTransactions((prev) => {
      const updated = [payoutTx, ...prev];
      safeSave('peerwork_transactions', updated);
      return updated;
    });

    // Update freelancer's balance in state
    setAllUsers((users) => {
      const updated = users.map((u) => {
        if (u.id === order.freelancer_id) {
          return {
            ...u,
            wallet_balance: u.wallet_balance + order.amount,
            total_earned: u.total_earned + order.amount,
          };
        }
        return u;
      });
      safeSave('hw_paavs_all_users', updated);
      return updated;
    });

    // If current user is the freelancer, update immediately
    if (currentUser.id === order.freelancer_id) {
      setCurrentUser((prev) => {
        const updated = {
          ...prev,
          wallet_balance: prev.wallet_balance + order.amount,
          total_earned: prev.total_earned + order.amount,
        };
        safeSave('hw_paavs_user', updated);
        return updated;
      });
    }
  };

  // Realtime order messaging
  const sendOrderMessage = (orderId: string, messageText: string, attachmentName?: string, attachmentUrl?: string) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      order_id: orderId,
      sender_id: currentUser.id,
      sender: currentUser,
      message: messageText,
      attachment_name: attachmentName,
      attachment_url: attachmentUrl,
      created_at: new Date().toISOString(),
    };

    setOrders((prev) => {
      const updated = prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            messages: [...(ord.messages || []), newMessage],
          };
        }
        return ord;
      });
      safeSave('peerwork_orders', updated);
      return updated;
    });
  };

  // Submit Review and recalculate student rating score
  const submitReview = (reviewInput: Omit<Review, 'id' | 'reviewer_id' | 'created_at'>) => {
    const newReview: Review = {
      ...reviewInput,
      id: `rev_${Date.now()}`,
      reviewer_id: currentUser.id,
      reviewer: currentUser,
      created_at: new Date().toISOString(),
    };

    setReviews((prev) => {
      const updated = [newReview, ...prev];
      safeSave('peerwork_reviews', updated);
      return updated;
    });

    const userReviews = [...reviews.filter((r) => r.reviewee_id === reviewInput.reviewee_id), newReview];
    const avg = Number((userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(2));

    setAllUsers((users) => {
      const updated = users.map((u) => {
        if (u.id === reviewInput.reviewee_id) {
          return {
            ...u,
            rating_average: avg,
            rating_count: userReviews.length,
          };
        }
        return u;
      });
      safeSave('hw_paavs_all_users', updated);
      return updated;
    });

    if (currentUser.id === reviewInput.reviewee_id) {
      setCurrentUser((prev) => {
        const updated = { ...prev, rating_average: avg, rating_count: userReviews.length };
        safeSave('hw_paavs_user', updated);
        return updated;
      });
    }
  };

  // Add Funds via Payment Gateway
  const addFundsToWallet = (amount: number, method: string): WalletTransaction => {
    const tx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      user_id: currentUser.id,
      amount: amount,
      type: 'credit',
      description: `Wallet deposit via ${method}`,
      created_at: new Date().toISOString(),
    };

    setTransactions((prev) => {
      const updated = [tx, ...prev];
      safeSave('peerwork_transactions', updated);
      return updated;
    });

    setCurrentUser((prev) => {
      const updated = {
        ...prev,
        wallet_balance: prev.wallet_balance + amount,
      };
      safeSave('hw_paavs_user', updated);
      setAllUsers((users) => {
        const nextUsers = users.map((u) => (u.id === prev.id ? updated : u));
        safeSave('hw_paavs_all_users', nextUsers);
        return nextUsers;
      });
      return updated;
    });

    return tx;
  };

  // Withdraw funds to student UPI
  const withdrawFunds = (amount: number, upiId: string): boolean => {
    if (currentUser.wallet_balance < amount || amount <= 0) return false;

    const tx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      user_id: currentUser.id,
      amount: amount,
      type: 'debit',
      description: `Instant IMPS/UPI payout to ${upiId}`,
      created_at: new Date().toISOString(),
    };

    setTransactions((prev) => {
      const updated = [tx, ...prev];
      safeSave('peerwork_transactions', updated);
      return updated;
    });

    setCurrentUser((prev) => {
      const updated = {
        ...prev,
        wallet_balance: prev.wallet_balance - amount,
      };
      safeSave('hw_paavs_user', updated);
      setAllUsers((users) => {
        const nextUsers = users.map((u) => (u.id === prev.id ? updated : u));
        safeSave('hw_paavs_all_users', nextUsers);
        return nextUsers;
      });
      return updated;
    });
    return true;
  };

  // Add Nav Coins (from arcade / achievements)
  const addNavCoins = (coins: number, source: string) => {
    setCurrentUser((prev) => {
      const updatedCoins = (prev.nav_coins || 0) + coins;
      const updatedUser = { ...prev, nav_coins: updatedCoins };
      safeSave('hw_paavs_user', updatedUser);
      setAllUsers((users) => {
        const nextUsers = users.map((u) => (u.id === prev.id ? updatedUser : u));
        safeSave('hw_paavs_all_users', nextUsers);
        return nextUsers;
      });
      return updatedUser;
    });
  };

  // Convert Nav Coins into real INR (100k Nav Coins = ₹1)
  const convertNavCoinsToRupees = (coinsToConvert: number): boolean => {
    const minRequired = 100000;
    if (coinsToConvert < minRequired) return false;
    if ((currentUser.nav_coins || 0) < coinsToConvert) return false;

    const rupeesGained = Math.floor(coinsToConvert / 100000);
    if (rupeesGained <= 0) return false;

    const actualCoinsUsed = rupeesGained * 100000;

    const tx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      user_id: currentUser.id,
      amount: rupeesGained,
      type: 'credit',
      description: `Converted ${actualCoinsUsed.toLocaleString()} Nav Coins to ₹${rupeesGained}`,
      created_at: new Date().toISOString(),
    };

    setTransactions((prev) => {
      const updated = [tx, ...prev];
      safeSave('peerwork_transactions', updated);
      return updated;
    });

    setCurrentUser((prev) => {
      const updatedUser = {
        ...prev,
        nav_coins: (prev.nav_coins || 0) - actualCoinsUsed,
        wallet_balance: prev.wallet_balance + rupeesGained,
      };
      safeSave('hw_paavs_user', updatedUser);
      setAllUsers((users) => {
        const nextUsers = users.map((u) => (u.id === prev.id ? updatedUser : u));
        safeSave('hw_paavs_all_users', nextUsers);
        return nextUsers;
      });
      return updatedUser;
    });

    return true;
  };

  return (
    <MarketplaceContext.Provider
      value={{
        currentUser,
        allUsers,
        isAuthenticated,
        loginUser,
        registerUser,
        logoutUser,
        switchUser,
        updateCurrentUserProfile,
        gigs,
        postGig,
        deleteGig,
        clearAllGigs,
        proposals,
        submitProposal,
        acceptProposal,
        orders,
        getOrderById,
        submitDeliverable,
        approveOrder,
        sendOrderMessage,
        reviews,
        submitReview,
        transactions,
        addFundsToWallet,
        withdrawFunds,
        addNavCoins,
        convertNavCoinsToRupees,
        theme,
        toggleTheme,
        isRealSupabase,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within MarketplaceProvider');
  }
  return context;
}
