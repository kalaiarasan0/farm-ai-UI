import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import Toast from './Toast';
import { Pencil, Check, X, ArrowLeft } from 'lucide-react';
import styled, { css } from 'styled-components';

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

const Form = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 900px;
  background: var(--card-bg);
  padding: 32px;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  border: 1px solid var(--card-border);
`;

const FieldGroup = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
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
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// const Input = styled.input`
//   width: 100%;
//   flex: 1;
//   padding: 12px 14px;
//   border-radius: 6px;
//   border: 1px solid ${({ $isEditing }) =>
//     $isEditing ? 'var(--primary-color)' : 'var(--input-border)'};
//   background-color: ${({ $isEditing }) =>
//     $isEditing ? 'var(--input-bg)' : 'transparent'};
//   color: var(--text-primary);
//   font-size: 15px;

//   &:focus {
//      outline: none;
//      border-color: var(--input-border-focus);
//   }
// `;

// const Textarea = styled(Input.withComponent('textarea'))`
//   resize: vertical;
//   min-height: 100px;
// `;

const inputStyles = css`
  width: 100%;
  flex: 1;
  padding: 12px 14px;
  border-radius: 6px;
  border: 1px solid ${({ $isEditing }) =>
    $isEditing ? 'var(--primary-color)' : 'var(--input-border)'};
  background-color: ${({ $isEditing }) =>
    $isEditing ? 'var(--input-bg)' : 'transparent'};
  color: var(--text-primary);
  font-size: 15px;

  &:focus {
    outline: none;
    border-color: var(--input-border-focus);
  }
`;
const Input = styled.input`
  ${inputStyles}
`;

const Textarea = styled.textarea`
  ${inputStyles}
  resize: vertical;
  min-height: 100px;
`;


const IconButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: var(--button-bg); /* Or input-bg? let's stick to button conventions or transparent? Original was theme based bg */
  background: var(--input-bg);
  cursor: pointer;
  flex-shrink: 0;

  color: var(--text-secondary);
  transition: all 0.2s;

  &:hover {
    color: var(--primary-color);
    border-color: var(--primary-color);
  }

  &.save:hover {
    color: #4ade80; /* Success green */
    border-color: #22c55e;
    background-color: rgba(34, 197, 94, 0.1);
  }

  &.cancel:hover {
    color: #ef4444;
    border-color: #ef4444;
    background-color: rgba(239, 68, 68, 0.1);
  }
  
  & > svg {
    stroke: currentColor;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px;
  font-size: 18px;
  color: var(--text-secondary);
`;

const ErrorWrapper = styled.div`
  padding: 20px;
  color: #ef4444;
  text-align: center;
`;

const CategoryDetails = () => {
  const navigate = useNavigate();
  // useTheme removed
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // State for tracking which field is being edited
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategoryById(id);
      setCategory(data);
    } catch (err) {
      // console.error("Failed to fetch category", err);
      setError(err.message || "Failed to load category");
    } finally {
      setLoading(false);
    }
  };

  const handleEditStart = (field, value) => {
    setEditingField(field);
    setTempValue(value || "");
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue("");
  };

  const handleUpdate = async (field) => {
    try {
      const payload = {
        id: category.category_id,
        [field]: tempValue
      };

      await categoryService.updateCategory(payload);

      setCategory(prev => ({
        ...prev,
        [field]: tempValue
      }));

      setToast({ message: `Updated ${field} successfully!`, type: 'success' });
      setEditingField(null);
    } catch (err) {
      // console.error("Update failed", err);
      setToast({ message: `Failed to update ${field}: ${err.message}`, type: 'error' });
    }
  };

  const renderField = (label, fieldKey, isReadOnly = false, inputProps = {}, isTextarea = false) => {
    if (!category) return null;

    const isEditing = editingField === fieldKey;
    const value = isEditing ? tempValue : (category[fieldKey] || '');

    return (
      <FieldGroup>
        <Label>{label}</Label>
        <InputWrapper>
          {/* <Input
            value={value}
            readOnly={!isEditing}
            $isEditing={isEditing}
            onChange={(e) => setTempValue(e.target.value)}
            {...inputProps}
          /> */}

          {isTextarea ? (
            <Textarea
              value={value}
              readOnly={!isEditing}
              $isEditing={isEditing}
              onChange={(e) => setTempValue(e.target.value)}
              {...inputProps}
            />
          ) : (
            <Input
              value={value}
              readOnly={!isEditing}
              $isEditing={isEditing}
              onChange={(e) => setTempValue(e.target.value)}
              {...inputProps}
            />
          )}

          {!isReadOnly && (
            <>
              {isEditing ? (
                <>
                  <IconButton
                    className="save"
                    onClick={() => handleUpdate(fieldKey)}
                    title="Save"
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "2px" }}>
                      <Check size={18} />
                    </div>
                  </IconButton>

                  <IconButton
                    className="cancel"
                    onClick={handleCancelEdit}
                    title="Cancel"
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "2px" }}>
                      <X size={18} />
                    </div>
                  </IconButton>
                </>
              ) : (
                <IconButton
                  onClick={() => handleEditStart(fieldKey, category[fieldKey])}
                  title="Edit"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "2px" }}>
                    <Pencil size={18} />
                  </div>
                </IconButton>
              )}

            </>
          )}
        </InputWrapper>
      </FieldGroup>
    );
  };

  if (loading) return <LoadingWrapper>Loading Category details...</LoadingWrapper>;
  if (error) return <ErrorWrapper>Error: {error}</ErrorWrapper>;
  if (!category) return <ErrorWrapper>Category not found</ErrorWrapper>;

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
        <Title> Category Details</Title>
      </Header>

      <Form>
        {renderField("Category ID", "category_id", true)}
        {renderField("Name", "name")}
        {renderField("Species", "species")}
        {renderField("SKU", "sku")}
        {renderField("Base Price", "base_price", false, { type: "number", step: "0.01" })}
        {renderField("Specs", "specs")}
        {/* {renderField("Description", "description")} */}
        {renderField("Description", "description", false, {}, true)}
        {renderField("Created Time", "created_at", true)}
        {renderField("Updated Time", "updated_at", true)}
      </Form>
    </Container>
  );
};
export default CategoryDetails;
