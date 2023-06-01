import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField, Box, Container, Typography,InputLabel, FormControlLabel, Checkbox, Select, MenuItem, FormControl } from '@mui/material';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';

const initialFormValues = {
  companyName: '',
  contactInformation: {
    email: '',
    phoneNumber: '',
    website: '',
  },
  menus: [
    {
      name: '',
      menuType: '',
      items: [],
      pricePerServing: 0,
    },
  ],
  delivery: false,
  capacity: 0,
  specialSpecifications: {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    lactoseFree: false,
    halal: false,
  },
};

function AddCateringCompanyForm() {
  const [formValues, setFormValues] = useState(initialFormValues);

  const handleInputChange = (event, field) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      contactInformation: {
        ...prevValues.contactInformation,
        [field]: event.target.value,
      },
    }));
  };
  const handleAddMenuItem = (menuIndex) => {
    setFormValues((prevValues) => {
      const updatedMenus = [...prevValues.menus];
      updatedMenus[menuIndex].items.push('');
      return {
        ...prevValues,
        menus: updatedMenus,
      };
    });
  };
  

  const handleMenuInputChange = (event, index) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => {
      const updatedMenus = [...prevValues.menus];
      updatedMenus[index] = {
        ...updatedMenus[index],
        [name]: value,
      };
      return {
        ...prevValues,
        menus: updatedMenus,
      };
    });
  };

  const handleItemInputChange = (event, menuIndex, itemIndex) => {
    const { value } = event.target;
    setFormValues((prevValues) => {
      const updatedMenus = [...prevValues.menus];
      const updatedItems = [...updatedMenus[menuIndex].items];
      updatedItems[itemIndex] = value;
      updatedMenus[menuIndex] = {
        ...updatedMenus[menuIndex],
        items: updatedItems,
      };
      return {
        ...prevValues,
        menus: updatedMenus,
      };
    });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      specialSpecifications: {
        ...prevValues.specialSpecifications,
        [name]: checked,
      },
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    
    // Convert the formValues to the desired payload format for the API
    const payload = {
      ...formValues,
      specialSpecifications: Object.keys(formValues.specialSpecifications)
      .filter((key) => formValues.specialSpecifications[key])
      .map((checkboxName) => checkboxName.toUpperCase()),
  };

  // Replace 'YOUR_BEARER_TOKEN' with your actual bearer token
  const bearerToken = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInN1YiI6Im1vc2xlbUBnbWFpbC5jb20iLCJpYXQiOjE2ODU2MTEwMDgsImV4cCI6MTY4NzA1MTAwOH0.3ftGTel_7bSXsPoGTX24sok7qJFCjqxQu1KbxvVI-ok';
console.log(payload)
    fetch('http://localhost:8080/api/catering', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(payload),
    })
    .then((response) => {
        if (response.ok) {
            console.log(response.status)
          // Reset the form values
          setFormValues(initialFormValues);
          // Trigger any additional actions or notifications upon successful form submission
          onFormSubmit();
        } else {
          throw new Error('Request failed');
        }
      })
      .catch((error) => {
        // Handle any errors that occur during the API request
        console.error('Error:', error);
        // Trigger any error notifications or fallback actions
      });
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} mb={2}>
        <Typography variant="h4" align="center">
          Add Catering Company
        </Typography>
      </Box>
      <form onSubmit={handleFormSubmit}>
        {/* Company Information */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Company Information</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <TextField
                name="companyName"
                label="Company Name"
                value={formValues.companyName}
                onChange={(event) => setFormValues({ ...formValues, companyName: event.target.value })}
                required
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                name="email"
                label="Email"
                value={formValues.contactInformation.email}
                onChange={(event) => handleInputChange(event, 'email')}
                required
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                name="phoneNumber"
                label="Phone Number"
                value={formValues.contactInformation.phoneNumber}
                onChange={(event) => handleInputChange(event, 'phoneNumber')}
                required
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                name="website"
                label="Website"
                value={formValues.contactInformation.website}
                onChange={(event) => handleInputChange(event, 'website')}
                required
                fullWidth
                sx={{ mb: 2 }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Menus */}
       <Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography>Menus</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
    {formValues.menus.map((menu, menuIndex) => (
  <Box key={menuIndex} sx={{ mb: 2 }}>
    <Typography variant="subtitle1" gutterBottom>
      Menu {menuIndex + 1}
    </Typography>
    <TextField
      name="name"
      label="Menu Name"
      value={menu.name}
      onChange={(event) => handleMenuInputChange(event, menuIndex)}
      required
      fullWidth
      sx={{ mb: 1 }}
    />
<FormControl fullWidth>
          <InputLabel id={`menu-${menuIndex}-type-label`}>
            {menu.menuType ? '' : 'Choose Menu Type'}
          </InputLabel>
          <Select
            id={`menu-${menuIndex}-type`}
            name="menuType"
            value={menu.menuType}
            onChange={(event) => handleMenuInputChange(event, menuIndex)}
            sx={{ mb: 2, height: '40px' }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 400,
                },
              },
            }}
            labelId={`menu-${menuIndex}-type-label`}
            label={menu.menuType ? '' : 'Choose Menu Type'}
          >
            <MenuItem value="BREAKFAST">BREAKFAST</MenuItem>
            <MenuItem value="LUNCH">LUNCH</MenuItem>
            <MenuItem value="DINNER">DINNER</MenuItem>
          </Select>
        </FormControl>
    {menu.items.map((item, itemIndex) => (
      <TextField
        key={itemIndex}
        label={`Item ${itemIndex + 1}`}
        value={item}
        onChange={(event) => handleItemInputChange(event, menuIndex, itemIndex)}
        required
        fullWidth
        sx={{ mb: 1 }}
      />
    ))}
<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
<Button
  variant="contained"
  size="small"
  onClick={() => handleAddMenuItem(menuIndex)}
  style={{ fontSize: '12px', padding: '5px 10px' }}
>
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <span style={{ marginLeft: '5px', color: 'white' }}>Add Item</span>
  </Box>
</Button>
<br/>
  <TextField
    name="pricePerServing"
    label="Price Per Serving"
    type="number"
    value={menu.pricePerServing}
    onChange={(event) => handleMenuInputChange(event, menuIndex)}
    required
    fullWidth
    sx={{ ml: 2 }}
  />
</Box>
  </Box>
))}

      <Button
        variant="contained"
        onClick={() => setFormValues({ ...formValues, menus: [...formValues.menus, { items: [] }] })}
      >
       <span style={{ marginLeft: '5px', color: 'white' }}> Add Menu</span>
      </Button>
    </Box>
  </AccordionDetails>
</Accordion>

        {/* Special Specifications */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Special Specifications</Typography>
          </AccordionSummary>
          <AccordionDetails>
  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
    {/* ... */}
    <FormControlLabel
      control={
        <Checkbox
          name="vegetarian"
          checked={formValues.specialSpecifications.vegetarian}
          onChange={handleCheckboxChange}
        />
      }
      label="Vegetarian"
    />
    <FormControlLabel
      control={
        <Checkbox
          name="vegan"
          checked={formValues.specialSpecifications.vegan}
          onChange={handleCheckboxChange}
        />
      }
      label="Vegan"
    />
    <FormControlLabel
      control={
        <Checkbox
          name="glutenFree"
          checked={formValues.specialSpecifications.glutenFree}
          onChange={handleCheckboxChange}
        />
      }
      label="Gluten Free"
    />
    <FormControlLabel
      control={
        <Checkbox
          name="lactoseFree"
          checked={formValues.specialSpecifications.lactoseFree}
          onChange={handleCheckboxChange}
        />
      }
      label="Lactose Free"
    />
    <FormControlLabel
      control={
        <Checkbox
          name="halal"
          checked={formValues.specialSpecifications.halal}
          onChange={handleCheckboxChange}
        />
      }
      label="Halal"
    />
  </Box>
</AccordionDetails>
        </Accordion>

        {/* Delivery */}
        <FormControlLabel
          control={
            <Checkbox
              name="delivery"
              checked={formValues.delivery}
              onChange={(event) => setFormValues({ ...formValues, delivery: event.target.checked })}
            />
          }
          label="Delivery"
        />

        {/* Capacity */}
        <TextField
          name="capacity"
          label="Capacity"
          type="number"
          value={formValues.capacity}
          onChange={(event) => setFormValues({ ...formValues, capacity: event.target.value })}
          fullWidth
          sx={{ mt: 2, mb: 2 }}
        />

        {/* Submit Button */}
        <Button variant="contained" type="submit">
          <span style={{ marginLeft: '5px', color: 'white' }}>Submit</span>
        </Button>
      </form>
    </Container>
  );
}


export default AddCateringCompanyForm;
