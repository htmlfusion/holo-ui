#!/usr/bin/env python

import argparse
import numpy as np
import transformations
import json


def normalizeKinectData(jsonData):
	box = jsonData['box']
	npBox = np.array(box)/10;
	npBox[:,0] = npBox[:,0]*-1;
	return npBox;

if (__name__ == '__main__'):
	parser = argparse.ArgumentParser(description='Align measured qube virtual qube')
	parser.add_argument('--samples', nargs='+', help='One or more json files containing cube data.', required=True)
	parser.add_argument('--target', help='JSON File containing the virtual qubes location', required=True)
	parser.add_argument('--output', help='Location to write alignment matrix to', required=True)

	args = parser.parse_args()

	averageSample = None
	for sample in args.samples:
		with open(sample) as jsonFile:
			jsonData = json.load(jsonFile)
			npBox = normalizeKinectData(jsonData);
			if averageSample is not None:
				averageSample = np.add(averageSample , npBox)
			else:
				averageSample = npBox;

	averageSample = (averageSample/len(args.samples)).transpose()

	with open(args.target) as targetFile:
		jsonData = json.load(targetFile);
		targetBox = np.array(jsonData['box']).transpose()

		print "Sample"
		print averageSample.transpose()
		print averageSample.shape

		print "\nTarget"
		print targetBox.transpose()
		print targetBox.shape
		offset = transformations.superimposition_matrix(averageSample, targetBox, scale=True);

		print "\nOffset matrix"
		print offset

		print "\nWith transform"
		averageSample = np.vstack((averageSample,[1,1,1,1,1,1]))
		#print averageSample.transpose()
		matrix = np.dot(offset, averageSample).flatten().tolist();

		with open(args.output, 'w') as matrixFile:
			json.dump(matrix, matrixFile)

