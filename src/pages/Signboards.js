import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Switch,
  TextField,
  IconButton,
  Tooltip
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { updateSignboardAction } from '../services/api';
import { toast } from 'react-toastify';

const Signboards = () => {
  const [signboards, setSignboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPrice, setEditingPrice] = useState({});
  const [priceValues, setPriceValues] = useState({});

  useEffect(() => {
    fetchSignboards();
  }, []);

  const fetchSignboards = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/signboards`);

      if (!response.ok) {
        throw new Error('Veri yüklenirken hata oluştu');
      }

      const result = await response.json();
      console.log('API Response:', result); // Debug için

      // API'den gelen veri result.data içinde
      const signboardsArray = result.data || [];
      setSignboards(signboardsArray);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatLightingType = (type) => {
    const types = {
      'illuminated': 'Işıklı',
      'non-illuminated': 'Işıksız'
    };
    return types[type] || type;
  };

  const formatBackgroundType = (type) => {
    const types = {
      'solid': 'Düz',
      'gradient': 'Gradyan'
    };
    return types[type] || type;
  };

  // is_actions toggle handler
  const handleIsActionsToggle = async (signboardId, currentValue) => {
    try {
      const newValue = currentValue === 1 ? 0 : 1;
      await updateSignboardAction(signboardId, { is_actions: newValue });

      // Update local state
      setSignboards(signboards.map(sb =>
        sb.id === signboardId ? { ...sb, is_actions: newValue } : sb
      ));

      toast.success(`İşlem durumu ${newValue === 1 ? 'aktif' : 'pasif'} olarak güncellendi`);
    } catch (error) {
      console.error('Error updating is_actions:', error);
      toast.error('İşlem durumu güncellenirken hata oluştu');
    }
  };

 

  // total_price update handler
  const handlePriceUpdate = async (signboardId) => {
    try {
      const newPrice = priceValues[signboardId];

      if (!newPrice || isNaN(newPrice) || parseFloat(newPrice) < 0) {
        toast.error('Geçerli bir fiyat giriniz');
        return;
      }

      await updateSignboardAction(signboardId, { total_price: parseFloat(newPrice) });

      // Update local state
      setSignboards(signboards.map(sb =>
        sb.id === signboardId ? { ...sb, total_price: parseFloat(newPrice) } : sb
      ));

      setEditingPrice({ ...editingPrice, [signboardId]: false });
      toast.success('Fiyat başarıyla güncellendi');
    } catch (error) {
      console.error('Error updating total_price:', error);
      toast.error('Fiyat güncellenirken hata oluştu');
    }
  };

  const handlePriceEdit = (signboardId, currentPrice) => {
    setEditingPrice({ ...editingPrice, [signboardId]: true });
    setPriceValues({ ...priceValues, [signboardId]: currentPrice || '' });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Tabelalar
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Tabela Yazısı</strong></TableCell>
              <TableCell><strong>Müşteri Adı</strong></TableCell>
              <TableCell><strong>Telefon</strong></TableCell>
              <TableCell><strong>E-posta</strong></TableCell>
              <TableCell><strong>Boyutlar (cm)</strong></TableCell>
              <TableCell><strong>Harf Yüksekliği (cm)</strong></TableCell>
              <TableCell><strong>Malzeme</strong></TableCell>
              <TableCell><strong>Işıklandırma</strong></TableCell>
              <TableCell><strong>Yazı Tipi</strong></TableCell>
              <TableCell><strong>Yazı Boyutu</strong></TableCell>
              <TableCell><strong>Arkaplan</strong></TableCell>
              <TableCell><strong>Arkaplan Rengi</strong></TableCell>
              <TableCell><strong>Toplam Fiyat (₺)</strong></TableCell>
              <TableCell><strong>İşlem Durumu</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {signboards.length === 0 ? (
              <TableRow>
                <TableCell colSpan={15} align="center">
                  <Typography variant="body2" color="textSecondary">
                    Henüz tabela bulunmuyor
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              signboards.map((signboard, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {signboard.signboard_text}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {signboard.username || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {signboard.user_phone || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {signboard.user_email || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {signboard.width} × {signboard.height}
                  </TableCell>
                  <TableCell>{signboard.letter_height}</TableCell>
                  <TableCell>
                    <Chip
                      label={signboard.letter_material}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={formatLightingType(signboard.lighting_type)}
                      size="small"
                      color={signboard.lighting_type === 'illuminated' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>{signboard.font_family}</TableCell>
                  <TableCell>{signboard.font_size}px</TableCell>
                  <TableCell>{formatBackgroundType(signboard.background_type)}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          backgroundColor: signboard.background_color,
                          border: '1px solid #ccc',
                          borderRadius: 1
                        }}
                      />
                      <Typography variant="caption">
                        {signboard.background_color}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Total Price Column */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {editingPrice[signboard.id] ? (
                        <>
                          <TextField
                            size="small"
                            type="number"
                            value={priceValues[signboard.id] || ''}
                            onChange={(e) =>
                              setPriceValues({
                                ...priceValues,
                                [signboard.id]: e.target.value
                              })
                            }
                            sx={{ width: '100px' }}
                            slotProps={{
                              htmlInput: { min: 0, step: 0.01 }
                            }}
                          />
                          <Tooltip title="Kaydet">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handlePriceUpdate(signboard.id)}
                            >
                              <SaveIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <Box
                          sx={{ cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
                          onClick={() => handlePriceEdit(signboard.id, signboard.total_price)}
                        >
                          <Typography variant="body2">
                            {signboard.total_price
                              ? `${parseFloat(signboard.total_price).toFixed(2)} ₺`
                              : 'Fiyat Belirle'}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </TableCell>

                  {/* is_actions Toggle Column */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Switch
                        checked={signboard.is_actions === 1}
                        onChange={() =>
                          handleIsActionsToggle(signboard.id, signboard.is_actions)
                        }
                        color="primary"
                      />
                      <Typography variant="caption">
                        {signboard.is_actions === 1 ? 'Aktif' : 'Pasif'}
                      </Typography>
                    </Box>
                  </TableCell>

                 
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Signboards;
