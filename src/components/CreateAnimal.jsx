import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ArrowLeft, Save, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { animalService } from '../services/animalService';
import { categoryService } from '../services/categoryService'; // For lookups
import Toast from './Toast';

const Container = styled.div`
  padding: 24px;
  width: 100%;
  color: var(--text-primary);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  gap: 16px;
`;



const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  color: var(--text-primary);
  &:hover {
    background-color: var(--bg-secondary);
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: var(--card-bg);
  padding: 32px;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  border: 1px solid var(--card-border);
`;

const FieldGroup = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  align-items: center;
  gap: 24px;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--text-secondary);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--input-border);
  background-color: var(--input-bg);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--input-border);
  background-color: var(--input-bg);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

// const Button = styled.button`
//   background-color: var(--primary-color);
//   color: white;
//   padding: 0.75rem 1.5rem;
//   border-radius: 6px;
//   border: none;
//   font-weight: 500;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   align-self: flex-start;
//   margin-top: 1rem;

//   &:hover {
//     background-color: var(--button-hover);
//   }

//   &:disabled {
//     opacity: 0.7;
//     cursor: not-allowed;
//   }
// `;


const Button = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  border: 1px solid transparent;

  &.cancel {
    background-color: transparent;
    border-color: var(--border-color);
    color: var(--text-secondary);
    &:hover {
      background-color: var(--bg-secondary);
      color: var(--text-primary);
    }
  }

  &.submit {
    background-color: var(--primary-color);
    color: white;
    &:hover {
      background-color: var(--button-hover);
    }
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;

const CreateAnimal = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [categoryOptions, setCategoryOptions] = useState([]);

    const [formData, setFormData] = useState({
        category_id: '', // This will hold the Category ID (Main Animal ID)
        gender: '',
        birth_date: '',
        purchase_date: '',
        source: '',
        source_reference: '',
        purchase_price: 0,
        status: ''
    });

    const [errors, setErrors] = useState({});

    // Fetch category options for dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getCategoryLookups();
                setCategoryOptions(data);
                // Set default if available - REMOVED to force user selection
                // if (data.length > 0) {
                //     setFormData(prev => ({ ...prev, animal_id: data[0].id }));
                // }
            } catch (error) {
                console.error("Failed to fetch products/categories for lookup", error);
                setToast({ message: "Failed to load animal categories", type: "error" });
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when field is modified
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.category_id) newErrors.category_id = "Main Animal Category is required";
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.status) newErrors.status = "Status is required";
        if (!formData.source) newErrors.source = "Source is required";
        if (!formData.birth_date && formData.source === 'birth') {
            newErrors.birth_date = "Birth date is required when source is 'birth'";
        }

        if (formData.source === 'purchase') {
            if (!formData.purchase_date) newErrors.purchase_date = "Purchase date is required when source is 'purchase'";
            if (!formData.purchase_price) newErrors.purchase_price = "Purchase price is required when source is 'purchase'";
        }

        // Basic validation for dates if needed, e.g., not in future?

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            // Construct payload based on source
            const payload = {
                category_id: parseInt(formData.category_id),
                gender: formData.gender,
                status: formData.status,
                source: formData.source,
                source_reference: formData.source_reference
            };

            if (formData.source === 'birth') {
                payload.birth_date = formData.birth_date;
            } else if (formData.source === 'purchase') {
                payload.purchase_date = formData.purchase_date;
                payload.purchase_price = parseFloat(formData.purchase_price) || 0;
            }

            await animalService.createAnimal(payload);
            setToast({ message: "Animal created successfully!", type: "success" });

            // Navigate back to list after short delay
            setTimeout(() => {
                navigate('/animals');
            }, 1500);
        } catch (error) {
            console.error("Create animal failed", error);
            setToast({ message: error.message || "Failed to create animal", type: "error" });
            setLoading(false);
        }
    };

    return (
        <Container>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <Header>
                <BackButton onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </BackButton>
                <Title>Register New Animal</Title>
            </Header>

            <Form onSubmit={handleSubmit}>
                <FieldGroup>
                    <Label>Main Animal Category *</Label>
                    <div>
                        <Select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                        >
                            <option value="">Select Category...</option>
                            {categoryOptions.map(opt => (
                                <option key={opt.category_id} value={opt.category_id}>{opt.name}</option>
                            ))}
                        </Select>
                        {errors.category_id && <ErrorText>{errors.category_id}</ErrorText>}
                    </div>
                </FieldGroup>

                <FieldGroup>
                    <Label>Gender *</Label>
                    <Select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="">Select Gender...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </Select>
                    {errors.gender && <ErrorText>{errors.gender}</ErrorText>}
                </FieldGroup>

                <FieldGroup>
                    <Label>Status *</Label>
                    <Select name="status" value={formData.status} onChange={handleChange}>
                        <option value="">Select Status...</option>
                        <option value="alive">Alive</option>
                        <option value="sold">Sold</option>
                        <option value="dead">Dead</option>
                        <option value="transferred">Transferred</option>
                        <option value="in_inventory">In Inventory</option>
                    </Select>
                    {errors.status && <ErrorText>{errors.status}</ErrorText>}
                </FieldGroup>

                <FieldGroup>
                    <Label>Source *</Label>
                    <Select name="source" value={formData.source} onChange={handleChange}>
                        <option value="">Select Source...</option>
                        <option value="birth">Birth</option>
                        <option value="purchase">Purchase</option>
                    </Select>
                    {errors.source && <ErrorText>{errors.source}</ErrorText>}
                </FieldGroup>

                {formData.source === 'birth' && (
                    <FieldGroup>
                        <Label>Birth Date {formData.source === 'birth' && '*'}</Label>
                        <div>
                            <Input
                                type="date"
                                name="birth_date"
                                value={formData.birth_date}
                                onChange={handleChange}
                            />
                            {errors.birth_date && <ErrorText>{errors.birth_date}</ErrorText>}
                        </div>
                    </FieldGroup>
                )}

                {formData.source === 'purchase' && (
                    <>
                        <FieldGroup>
                            <Label>Purchase Date {formData.source === 'purchase' && '*'}</Label>
                            <div>
                                <Input
                                    type="date"
                                    name="purchase_date"
                                    value={formData.purchase_date}
                                    onChange={handleChange}
                                />
                                {errors.purchase_date && <ErrorText>{errors.purchase_date}</ErrorText>}
                            </div>
                        </FieldGroup>

                        <FieldGroup>
                            <Label>Purchase Price {formData.source === 'purchase' && '*'}</Label>
                            <div>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    name="purchase_price"
                                    value={formData.purchase_price}
                                    onChange={handleChange}
                                />
                                {errors.purchase_price && <ErrorText>{errors.purchase_price}</ErrorText>}
                            </div>
                        </FieldGroup>
                    </>
                )}

                <FieldGroup>
                    <Label>Source Reference</Label>
                    <Input
                        type="text"
                        name="source_reference"
                        placeholder="e.g. Batch #, Seller Name"
                        value={formData.source_reference}
                        onChange={handleChange}
                    />
                </FieldGroup>

                {/* <Button type="submit" disabled={loading}>
                    <Save size={20} />
                    {loading ? 'Creating...' : 'Create Animal'}
                </Button> */}
                <ButtonGroup>
                    <Button type="button" className="cancel" onClick={() => navigate(-1)}>
                        <ChevronLeft size={20} />
                        Cancel
                    </Button>
                    <Button type="submit" className="submit" disabled={loading}>
                        <Save size={20} />
                        {loading ? 'Creating...' : 'Save'}
                    </Button>
                </ButtonGroup>

            </Form>
        </Container>
    );
};

export default CreateAnimal;
