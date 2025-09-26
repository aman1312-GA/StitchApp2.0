import React from "react";
import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import { images } from "@/constants/images";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";

const WelcomeScreen = () => {
  return (
    <Box className="relative flex justify-center w-full">
      <Image
        source={images.welcomeBgImg}
        alt=""
        className="w-full h-full"
        resizeMode="cover"
      />
      <Box className="absolute top-0 left-0 w-full h-full inset-0 bg-black/50" />
      <Box className="justify-center absolute bottom-0 items-end z-50">
        <VStack className=" gap-3 flex-col">
          <VStack>
            <Heading className="text-white">Welcome to Stitch!</Heading>
            <Text className="text-white">The home for fashionista</Text>
          </VStack>
          <VStack>
            <Button>
              <ButtonText className="capitalize ">get started</ButtonText>
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default WelcomeScreen;
