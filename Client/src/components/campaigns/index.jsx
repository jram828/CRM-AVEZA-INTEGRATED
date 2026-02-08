import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCampaigns, getCampaignsTodos } from "../../redux/actions";

function Campaigns() {
  const dispatch = useDispatch();
  const campaigns = useSelector((state) => state.campaigns);
  const [loadingState, setLoadingState] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getCampaigns());
  }, [dispatch]);

  const totalPages = Math.ceil(campaigns?.length / 6);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingState(true);
      await dispatch(getCampaignsTodos(currentPage));
      setLoadingState(false);
    };
    fetchData();
  }, [dispatch, currentPage]);

  const handlePageChange = (_, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Campañas
      </Typography>

      <Box display="flex" justifyContent="center" mb={3}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {loadingState ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : campaigns && campaigns.length > 0 ? (
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          gap={3}
        >
          {campaigns.map((campaign) => (
            <Card key={campaign.idCampaign} sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" color="primary">
                  {campaign.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Descripción: {campaign.descripcion}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No hay campañas disponibles
        </Typography>
      )}
    </Box>
  );
}

export default Campaigns;