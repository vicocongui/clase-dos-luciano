import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import axios from 'axios';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [shows, setShows] = useState([]);
  const [show, setShow] = useState({});
  const [episodes, setEpisodes] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);

  const getShows = useCallback(async () => {
    setLoading(true);
    try {
      const showsReq = await axios.get(
        `https://api.tvmaze.com/shows`
      );
      setShows(showsReq.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getShows();
  }, [getShows]);

  const getShow = useCallback(async (id) => {
    setShowLoading(true);
    try {
      const show = await axios.get(`https://api.tvmaze.com/shows/${id}`);
      console.log(show.data);
      setShow(show.data);
      setShowLoading(false);
    } catch (error) {
      console.log('ERRORRR NO EXISTE SHOW');
    }
  }, []);

  const getSeasons = useCallback(async (id) => {
    setShowLoading(true);
    try {
      const season = await axios.get(`https://api.tvmaze.com/shows/${id}/seasons`);
      console.log("Temporada:",season.data)
      setSeasons(season.data);
      setShowLoading(false);
    } catch (error) {
      console.log('ERRORRR NO EXISTEN SEASONS');
    }
  }, []);


  return (
    <AppContext.Provider
      value={{
        shows,
        loading,
        getShow,
        show,
        showLoading,
        getSeasons,
        seasons
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContexts must be used within a AppContextProvider');
  }
  return context;
};

export default AppContext;