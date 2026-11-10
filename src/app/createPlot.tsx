import { useState, useRef } from "react";
import { View, Pressable, FlatList } from "react-native";
import { TextInput, Text, Button } from "react-native-paper";
import { plotRepository } from "../repositories/plotRepository";
import { useProfile } from "../context/ProfileContext";
import {
  Crop,
  validateCrop,
  PlotInput,
  normalizePlotInput,
} from "../domain/plot";
import { theme, tokens } from "../theme/theme";

type FormCrop = Crop & {
  id: string;
};

export default function CreatePlotScreen() {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [plantingYear, setPlantingYear] = useState("");
  const [cropError, setCropError] = useState("");
  const [crops, setCrops] = useState<FormCrop[]>([]);
  const [cropName, setCropName] = useState("");
  const [cropQuantity, setCropQuantity] = useState("");
  const [plotMessage, setPlotMessage] = useState("");
  const { email } = useProfile();

  const nextCropId = useRef(0);

  function handleAddCrop() {
    try {
      const newCrop: Crop = validateCrop({
        name: cropName,
        quantity: Number(cropQuantity),
      });
      const formCrop: FormCrop = {
        ...newCrop,
        id: String(nextCropId.current),
      };
      setCrops((previousCrops) => [...previousCrops, formCrop]);
      setCropName("");
      setCropQuantity("");
      setCropError("");
      nextCropId.current += 1;
    } catch {
      setCropError(
        "Informe uma cultura e uma quantidade inteira maior que zero.",
      );
    }
  }

  function getCropsInput(crops: FormCrop[]): Crop[] {
    return crops.map((crop) => ({
      name: crop.name,
      quantity: crop.quantity,
    }));
  }

  function handleRemoveCrop(id: string) {
    setCrops((previousCrops) => previousCrops.filter((crop) => crop.id !== id));
  }

  function parsePlotArea(value: string): number {
    const normalizedPlotArea = Number(value.trim().replace(",", "."));
    return normalizedPlotArea;
  }

  function getPlotInput(): PlotInput {
    const inputArea = parsePlotArea(area);
    const inputCrops = getCropsInput(crops);
    const inputPlantingYear =
      plantingYear.trim() !== "" ? Number(plantingYear) : undefined;

    return {
      name: name,
      area: inputArea,
      crops: inputCrops,
      plantingYear: inputPlantingYear,
    };
  }

  function handleSavePlot() {
    try {
      if (!email) {
        throw new Error("Perfil não identificado.");
      }
      const plotInput = getPlotInput();
      plotRepository.create(email, plotInput);
      setPlotMessage("Talhão cadastrado com sucesso");
    } catch {
      setPlotMessage("Verifique os dados do talhão.");
    }
  }

  return (
    <View>
      <TextInput
        label="Nome do Talhão"
        value={name}
        onChangeText={setName}
        mode="outlined"
      />
      <TextInput
        label="Área do Talhão (ha)"
        value={area}
        onChangeText={setArea}
        keyboardType="decimal-pad"
        mode="outlined"
      />
      <TextInput
        label="Ano de Plantio"
        value={plantingYear}
        onChangeText={setPlantingYear}
        keyboardType="number-pad"
        mode="outlined"
      />

      <TextInput
        label="Nome da cultura"
        value={cropName}
        onChangeText={setCropName}
        mode="outlined"
      />
      <TextInput
        label="Quantidade de plantas"
        value={cropQuantity}
        onChangeText={setCropQuantity}
        keyboardType="number-pad"
        mode="outlined"
      />
      {cropError !== "" && <Text style={{ color: "red" }}>{cropError}</Text>}
      <Pressable onPress={handleAddCrop}>
        <Text>Adicionar Cultura</Text>
      </Pressable>
      <FlatList
        data={crops}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>
              {item.name} - {item.quantity} plantas
            </Text>
            <Button
              // Remove somente a cultura correspondente.
              onPress={() => handleRemoveCrop(item.id)}
              mode="text"
            >
              Remover
            </Button>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhuma cultura adicionada.</Text>}
      ></FlatList>
      <Pressable onPress={handleSavePlot}>
        <Text>Salvar</Text>
      </Pressable>
      {plotMessage !== "" && <Text>{plotMessage}</Text>}
    </View>
  );
}
