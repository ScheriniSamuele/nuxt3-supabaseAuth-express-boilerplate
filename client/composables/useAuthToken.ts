export const useAuthToken = async () => {
    const supabase = useSupabaseClient();
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token !== undefined) return data.session.access_token;
    else return '';
};
